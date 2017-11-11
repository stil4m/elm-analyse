module Analyser exposing (main)

import Analyser.CodeBase as CodeBase exposing (CodeBase)
import Analyser.Configuration as Configuration exposing (Configuration)
import Analyser.ContextLoader as ContextLoader exposing (Context)
import Analyser.DependencyLoadingStage as DependencyLoadingStage
import Analyser.FileWatch as FileWatch exposing (FileChange(Remove, Update))
import Analyser.Files.Types exposing (LoadedSourceFile)
import Analyser.Fixer as Fixer
import Analyser.Messages.Util as Messages
import Analyser.Modules
import Analyser.SourceLoadingStage as SourceLoadingStage
import Analyser.State as State exposing (State)
import Analyser.State.Dependencies
import AnalyserPorts
import Inspection
import Json.Encode exposing (Value)
import Platform exposing (programWithFlags)
import Registry exposing (Registry)
import Time
import Util.Logger as Logger


type alias Model =
    { codeBase : CodeBase
    , context : Context
    , configuration : Configuration
    , stage : Stage
    , state : State
    , changedFiles : List String
    , server : Bool
    , registry : Registry
    }


type Msg
    = OnContext Context
    | DependencyLoadingStageMsg DependencyLoadingStage.Msg
    | SourceLoadingStageMsg SourceLoadingStage.Msg
    | Change FileChange
    | ReloadTick
    | Reset
    | OnFixMessage Int
    | FixerMsg Fixer.Msg


type Stage
    = ContextLoadingStage
    | DependencyLoadingStage DependencyLoadingStage.Model
    | SourceLoadingStage SourceLoadingStage.Model
    | FixerStage Fixer.Model
    | Finished


type alias Flags =
    { server : Bool
    , registry : Value
    }


main : Program Flags Model Msg
main =
    programWithFlags { init = init, update = update, subscriptions = subscriptions }


init : Flags -> ( Model, Cmd Msg )
init flags =
    reset
        ( { context = ContextLoader.emptyContext
          , stage = Finished
          , configuration = Configuration.defaultConfiguration
          , codeBase = CodeBase.init
          , state = State.initialState
          , changedFiles = []
          , server = flags.server
          , registry = Registry.fromValue flags.registry
          }
        , Cmd.none
        )


reset : ( Model, Cmd Msg ) -> ( Model, Cmd Msg )
reset ( model, cmds ) =
    ( { model
        | stage = ContextLoadingStage
        , state = State.initialState
        , codeBase = CodeBase.init
      }
    , Cmd.batch [ ContextLoader.loadContext (), cmds ]
    )
        |> doSendState


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        OnFixMessage messageId ->
            ( { model | state = State.addFixToQueue messageId model.state }
            , Cmd.none
            )
                |> handleNextStep

        Reset ->
            reset ( model, Cmd.none )

        OnContext context ->
            let
                ( configuration, messages ) =
                    Configuration.fromString context.configuration

                ( stage, cmds ) =
                    DependencyLoadingStage.init context.interfaceFiles
            in
            ( { model
                | context = context
                , configuration = configuration
                , stage = DependencyLoadingStage stage
              }
            , Cmd.batch <|
                Cmd.map DependencyLoadingStageMsg cmds
                    :: List.map Logger.info messages
            )
                |> doSendState

        DependencyLoadingStageMsg x ->
            case model.stage of
                DependencyLoadingStage stage ->
                    onDependencyLoadingStageMsg x stage model

                _ ->
                    ( model, Cmd.none )

        SourceLoadingStageMsg x ->
            case model.stage of
                SourceLoadingStage stage ->
                    onSourceLoadingStageMsg x stage model

                _ ->
                    ( model
                    , Cmd.none
                    )

        FixerMsg x ->
            case model.stage of
                FixerStage stage ->
                    onFixerMsg x stage model

                _ ->
                    ( model, Cmd.none )

        Change (Update x) ->
            doSendState
                ( { model
                    | state = State.outdateMessagesForFile x model.state
                    , changedFiles = x :: model.changedFiles
                  }
                , Cmd.none
                )

        ReloadTick ->
            if model.stage == Finished && model.changedFiles /= [] then
                startSourceLoading
                    model.changedFiles
                    ( { model | changedFiles = [] }
                    , Cmd.none
                    )
            else
                ( model
                , Cmd.none
                )

        Change (Remove x) ->
            doSendState
                ( { model
                    | state = State.removeMessagesForFile x model.state
                    , changedFiles = List.filter (not << (==) x) model.changedFiles
                  }
                , Logger.info ("File was removed: '" ++ x ++ "'. Removing known messages.")
                )


onFixerMsg : Fixer.Msg -> Fixer.Model -> Model -> ( Model, Cmd Msg )
onFixerMsg x stage model =
    let
        ( newFixerModel, fixerCmds ) =
            Tuple.mapSecond (Cmd.map FixerMsg) (Fixer.update model.codeBase x stage)
    in
    if Fixer.isDone newFixerModel then
        if Fixer.succeeded newFixerModel then
            ( { model | stage = Finished }, fixerCmds )
        else
            startSourceLoading (Messages.messageFiles (Fixer.message newFixerModel))
                ( model, fixerCmds )
    else
        ( { model | stage = FixerStage newFixerModel }
        , fixerCmds
        )


startSourceLoading : List String -> ( Model, Cmd Msg ) -> ( Model, Cmd Msg )
startSourceLoading files ( model, cmds ) =
    let
        ( nextStage, stageCmds ) =
            case files of
                [] ->
                    ( Finished, Cmd.none )

                files_ ->
                    SourceLoadingStage.init files_
                        |> Tuple.mapFirst SourceLoadingStage
                        |> Tuple.mapSecond (Cmd.map SourceLoadingStageMsg)
    in
    ( { model | stage = nextStage }
    , Cmd.batch [ stageCmds, cmds ]
    )


handleNextStep : ( Model, Cmd Msg ) -> ( Model, Cmd Msg )
handleNextStep (( model, cmds ) as input) =
    case model.stage of
        Finished ->
            case State.nextTask model.state of
                Nothing ->
                    input

                Just ( newState, taskId ) ->
                    case Fixer.init taskId newState of
                        Nothing ->
                            ( { model | state = newState }
                            , Logger.info ("Could not fix message: '" ++ toString taskId ++ "'.")
                            )

                        Just ( fixerModel, fixerCmds, newState2 ) ->
                            ( { model | state = newState2, stage = FixerStage fixerModel }
                            , Cmd.batch [ cmds, Cmd.map FixerMsg fixerCmds ]
                            )
                                |> doSendState

        _ ->
            input


doSendState : ( Model, Cmd Msg ) -> ( Model, Cmd Msg )
doSendState ( model, cmds ) =
    ( model
    , Cmd.batch [ cmds, AnalyserPorts.sendStateValue model.state ]
    )


onDependencyLoadingStageMsg : DependencyLoadingStage.Msg -> DependencyLoadingStage.Model -> Model -> ( Model, Cmd Msg )
onDependencyLoadingStageMsg x stage model =
    let
        ( newStage, cmds ) =
            DependencyLoadingStage.update x stage
    in
    if DependencyLoadingStage.isDone newStage then
        ( { model | codeBase = CodeBase.setDependencies (DependencyLoadingStage.getDependencies newStage) model.codeBase }
        , Cmd.map DependencyLoadingStageMsg cmds
        )
            |> startSourceLoading model.context.sourceFiles
    else
        ( { model | stage = DependencyLoadingStage newStage }
        , Cmd.map DependencyLoadingStageMsg cmds
        )


isSourceFileIncluded : Configuration -> LoadedSourceFile -> Bool
isSourceFileIncluded configuration =
    Tuple.first
        >> .path
        >> flip Configuration.isPathExcluded configuration
        >> not


finishProcess : SourceLoadingStage.Model -> Cmd SourceLoadingStage.Msg -> Model -> ( Model, Cmd Msg )
finishProcess newStage cmds model =
    let
        loadedSourceFiles =
            SourceLoadingStage.parsedFiles newStage

        includedSources =
            List.filter (isSourceFileIncluded model.configuration) loadedSourceFiles

        newCodeBase =
            CodeBase.addSourceFiles loadedSourceFiles model.codeBase

        messages =
            Inspection.run newCodeBase includedSources model.configuration

        ( unusedDeps, newModules ) =
            Analyser.Modules.build newCodeBase (CodeBase.sourceFiles newCodeBase)

        deps =
            Analyser.State.Dependencies.init (List.map .name unusedDeps) (CodeBase.dependencies newCodeBase) model.registry

        newState =
            State.finishWithNewMessages messages model.state
                |> State.updateModules newModules
                |> State.withDependencies deps

        newModel =
            { model
                | stage = Finished
                , state = newState
                , codeBase = newCodeBase
            }
    in
    ( newModel
    , Cmd.batch
        [ AnalyserPorts.sendReport
            { messages = newState.messages
            , modules = newState.modules
            , unusedDependencies = newState.dependencies.unused
            }
        , AnalyserPorts.sendStateValue newState
        , Cmd.map SourceLoadingStageMsg cmds
        ]
    )
        |> handleNextStep


onSourceLoadingStageMsg : SourceLoadingStage.Msg -> SourceLoadingStage.Model -> Model -> ( Model, Cmd Msg )
onSourceLoadingStageMsg x stage model =
    let
        ( newStage, cmds ) =
            SourceLoadingStage.update x stage
    in
    if SourceLoadingStage.isDone newStage then
        finishProcess newStage cmds model
    else
        ( { model | stage = SourceLoadingStage newStage }
        , Cmd.map SourceLoadingStageMsg cmds
        )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ AnalyserPorts.onReset (always Reset)
        , if model.server then
            Time.every Time.second (always ReloadTick)
          else
            Sub.none
        , FileWatch.watcher Change
        , AnalyserPorts.onFixMessage OnFixMessage
        , case model.stage of
            ContextLoadingStage ->
                ContextLoader.onLoadedContext OnContext

            DependencyLoadingStage stage ->
                DependencyLoadingStage.subscriptions stage |> Sub.map DependencyLoadingStageMsg

            SourceLoadingStage stage ->
                SourceLoadingStage.subscriptions stage |> Sub.map SourceLoadingStageMsg

            Finished ->
                Sub.none

            FixerStage stage ->
                Fixer.subscriptions stage |> Sub.map FixerMsg
        ]
