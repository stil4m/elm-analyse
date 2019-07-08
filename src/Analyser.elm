module Analyser exposing (main)

import Analyser.CodeBase as CodeBase exposing (CodeBase)
import Analyser.Configuration as Configuration exposing (Configuration)
import Analyser.ContextLoader as ContextLoader exposing (Context)
import Analyser.DependencyLoadingStage as DependencyLoadingStage
import Analyser.FileContext as FileContext exposing (FileContext)
import Analyser.FileWatch as FileWatch exposing (FileChange(..))
import Analyser.Files.Types exposing (LoadedSourceFile)
import Analyser.Fixer as Fixer
import Analyser.Messages.Util as Messages
import Analyser.Modules
import Analyser.SourceLoadingStage as SourceLoadingStage
import Analyser.State as State exposing (State)
import Analyser.State.Dependencies as Dependencies
import AnalyserPorts
import Elm.Project
import Elm.Version
import Inspection
import Json.Decode
import Json.Encode exposing (Value)
import Maybe.Extra as Maybe
import Platform exposing (worker)
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
    , project : Elm.Project.Project
    }


type Msg
    = OnContext Context
    | DependencyLoadingStageMsg DependencyLoadingStage.Msg
    | SourceLoadingStageMsg SourceLoadingStage.Msg
    | Change (Maybe FileChange)
    | ReloadTick
    | Reset
    | OnFixMessage Int
    | OnQuickFixMessage Int
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
    , project : Value
    }


main : Program Flags Model Msg
main =
    worker
        { init = init
        , update = update
        , subscriptions = subscriptions
        }


init : Flags -> ( Model, Cmd Msg )
init flags =
    let
        project =
            Json.Decode.decodeValue Elm.Project.decoder flags.project

        base =
            ( { context = ContextLoader.emptyContext
              , stage = Finished
              , configuration = Configuration.defaultConfiguration
              , codeBase = CodeBase.init
              , state = State.initialState
              , changedFiles = []
              , server = flags.server
              , registry = Registry.fromValue flags.registry
              , project =
                    Elm.Project.Application
                        { elm = Elm.Version.one
                        , dirs = []
                        , depsDirect = []
                        , depsIndirect = []
                        , testDepsDirect = []
                        , testDepsIndirect = []
                        }
              }
            , Cmd.none
            )
    in
    case project of
        Err _ ->
            ( Tuple.first base, Logger.error "Could not read project file (./elm.json)" )

        Ok v ->
            reset
                ( { context = ContextLoader.emptyContext
                  , stage = Finished
                  , configuration = Configuration.defaultConfiguration
                  , codeBase = CodeBase.init
                  , state = State.initialState
                  , changedFiles = []
                  , server = flags.server
                  , registry = Registry.fromValue flags.registry
                  , project = v
                  }
                , Logger.info "Started..."
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

        OnQuickFixMessage messageId ->
            let
                applyFix message =
                    getFileContext message.file.path model.codeBase
                        |> Maybe.map (Fixer.getFixedFile message)
                        |> Maybe.withDefault
                            (Err ("Unable to fix messageId: " ++ String.fromInt messageId))
            in
            case State.getMessage messageId model.state of
                Just message ->
                    case applyFix message of
                        Ok fixedFile ->
                            ( model
                            , AnalyserPorts.sendFixedFile
                                { path = message.file.path
                                , content = fixedFile
                                }
                            )

                        Err err ->
                            ( model
                            , Logger.error err
                            )

                Nothing ->
                    ( model
                    , Logger.info
                        ("Unable to apply fix, unable to find messageId: "
                            ++ String.fromInt messageId
                        )
                    )

        Reset ->
            reset ( model, Cmd.none )

        OnContext context ->
            let
                ( configuration, messages ) =
                    Configuration.fromString context.configuration

                ( stage, cmds ) =
                    DependencyLoadingStage.init model.project
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

        Change (Just (Update path maybeContent)) ->
            case maybeContent of
                Just content ->
                    let
                        finishQuick ( sourceModel, sourceCmds ) =
                            finishProcess sourceModel
                                sourceCmds
                                { model | state = State.outdateMessagesForFile path model.state }
                    in
                    SourceLoadingStage.initWithContent content
                        |> finishQuick

                Nothing ->
                    startSourceLoading (path :: model.changedFiles)
                        ( { model
                            | state = State.outdateMessagesForFile path model.state
                            , changedFiles = []
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

        Change Nothing ->
            ( model, Cmd.none )

        Change (Just (Remove x)) ->
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
            startSourceLoading [ Messages.messageFile (Fixer.message newFixerModel) ]
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
                    files_
                        |> SourceLoadingStage.init
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
                            , Logger.info ("Could not fix message: '" ++ String.fromInt taskId ++ "'.")
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
      -- , Cmd.batch [ cmds, AnalyserPorts.sendStateValue model.state ]
    , cmds
    )


onDependencyLoadingStageMsg : DependencyLoadingStage.Msg -> DependencyLoadingStage.Model -> Model -> ( Model, Cmd Msg )
onDependencyLoadingStageMsg x stage model =
    let
        ( newStage, cmds ) =
            DependencyLoadingStage.update x stage
    in
    if DependencyLoadingStage.isDone newStage then
        let
            newDependencies =
                DependencyLoadingStage.getDependencies newStage
        in
        ( { model | codeBase = CodeBase.setDependencies newDependencies model.codeBase }
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
        >> (\a -> Configuration.isPathExcluded a configuration)
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

        mode =
            case model.project of
                Elm.Project.Application _ ->
                    Dependencies.Application

                Elm.Project.Package _ ->
                    Dependencies.Package

        deps =
            Dependencies.init mode (List.map .name unusedDeps) (CodeBase.dependencies newCodeBase) model.registry

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


getFileContext : String -> CodeBase -> Maybe FileContext
getFileContext path codeBase =
    CodeBase.getFile path codeBase
        |> Maybe.map
            (FileContext.buildForFile (CodeBase.processContext codeBase))
        |> Maybe.join


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ AnalyserPorts.onReset (always Reset)
        , if model.server then
            Time.every 1000 (always ReloadTick)

          else
            Sub.none
        , FileWatch.watcher Change
        , AnalyserPorts.onFixMessage OnFixMessage
        , AnalyserPorts.onFixQuick OnQuickFixMessage
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
