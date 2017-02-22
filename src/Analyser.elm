module Analyser exposing (main)

import Analyser.InterfaceLoadingStage as InterfaceLoadingStage
import Analyser.SourceLoadingStage as SourceLoadingStage
import AnalyserPorts
import Platform exposing (program)
import Inspection
import Analyser.Files.Types exposing (Dependency, Version)
import Analyser.State as State exposing (State)
import Analyser.Fixer as Fixer
import Tuple2
import Analyser.Messages.Util as Messages
import Analyser.ContextLoader as ContextLoader exposing (Context)
import Analyser.Configuration as Configuration exposing (Configuration)


type alias InputFiles =
    List String


type Msg
    = OnContext Context
    | InterfaceLoadingStageMsg InterfaceLoadingStage.Msg
    | SourceLoadingStageMsg SourceLoadingStage.Msg
    | Reset
    | OnFixMessage Int
    | FixerMsg Fixer.Msg


type alias Model =
    { dependencies : List Dependency
    , context : Context
    , configuration : Configuration
    , stage : Stage
    , state : State
    }


type Stage
    = ContextLoadingStage
    | InterfaceLoadingStage InterfaceLoadingStage.Model
    | SourceLoadingStage SourceLoadingStage.Model
    | FixerStage Fixer.Model
    | Finished


main : Program Never Model Msg
main =
    program { init = init, update = update, subscriptions = subscriptions }


init : ( Model, Cmd Msg )
init =
    reset
        { context = ContextLoader.emptyContext
        , stage = Finished
        , configuration = Configuration.defaultConfiguration
        , dependencies = []
        , state = State.initialState
        }


reset : Model -> ( Model, Cmd Msg )
reset model =
    ( { model | stage = ContextLoadingStage, state = State.initialState, dependencies = [] }
    , ContextLoader.loadContext ()
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
            init

        OnContext context ->
            let
                ( configuration, messages ) =
                    Configuration.fromString context.configuration
                        |> Debug.log "Conf"

                ( stage, cmds ) =
                    InterfaceLoadingStage.init context.interfaceFiles
            in
                ( { model
                    | context = context
                    , configuration = configuration
                    , stage = InterfaceLoadingStage stage
                  }
                , Cmd.map InterfaceLoadingStageMsg cmds
                )
                    |> doSendState

        InterfaceLoadingStageMsg x ->
            case model.stage of
                InterfaceLoadingStage stage ->
                    onInterfaceLoadingStageMsg x stage model

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


onFixerMsg : Fixer.Msg -> Fixer.Model -> Model -> ( Model, Cmd Msg )
onFixerMsg x stage model =
    let
        ( newFixerModel, fixerCmds ) =
            Fixer.update x stage
                |> Tuple2.mapSecond (Cmd.map FixerMsg)
    in
        if Fixer.isDone newFixerModel then
            if Fixer.succeeded newFixerModel then
                --TODO What to do with the checking and the state
                startSourceLoading
                    (Fixer.touchedFiles newFixerModel)
                    ( model, fixerCmds )
            else
                startSourceLoading (Messages.getFiles (Fixer.message newFixerModel).data)
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
                        |> Tuple2.mapFirst SourceLoadingStage
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
                            --TODO Log something here
                            ( { model | state = newState }
                            , Cmd.none
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
    , Cmd.batch [ cmds, AnalyserPorts.sendStateAsJson model.state ]
    )


onInterfaceLoadingStageMsg : InterfaceLoadingStage.Msg -> InterfaceLoadingStage.Model -> Model -> ( Model, Cmd Msg )
onInterfaceLoadingStageMsg x stage model =
    let
        ( newStage, cmds ) =
            InterfaceLoadingStage.update x stage
    in
        if InterfaceLoadingStage.isDone newStage then
            ( { model | dependencies = InterfaceLoadingStage.getDependencies newStage }
            , Cmd.map InterfaceLoadingStageMsg cmds
            )
                |> startSourceLoading model.context.sourceFiles
        else
            ( { model | stage = InterfaceLoadingStage newStage }
            , Cmd.map InterfaceLoadingStageMsg cmds
            )


onSourceLoadingStageMsg : SourceLoadingStage.Msg -> SourceLoadingStage.Model -> Model -> ( Model, Cmd Msg )
onSourceLoadingStageMsg x stage model =
    let
        ( newStage, cmds ) =
            SourceLoadingStage.update x stage
    in
        if SourceLoadingStage.isDone newStage then
            let
                messages =
                    Inspection.run (SourceLoadingStage.parsedFiles newStage) model.dependencies model.configuration

                newState =
                    State.finishWithNewMessages messages model.state

                newModel =
                    { model
                        | stage = Finished
                        , state = newState
                    }
            in
                ( newModel
                , Cmd.batch
                    [ AnalyserPorts.sendMessagesAsStrings newState.messages
                    , AnalyserPorts.sendMessagesAsJson newState.messages
                    , AnalyserPorts.sendStateAsJson newState
                    ]
                )
                    |> handleNextStep
        else
            ( { model | stage = SourceLoadingStage newStage }
            , Cmd.map SourceLoadingStageMsg cmds
            )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ AnalyserPorts.onReset (always Reset)
        , AnalyserPorts.onFixMessage OnFixMessage
        , case model.stage of
            ContextLoadingStage ->
                ContextLoader.onLoadedContext OnContext

            InterfaceLoadingStage stage ->
                InterfaceLoadingStage.subscriptions stage |> Sub.map InterfaceLoadingStageMsg

            SourceLoadingStage stage ->
                SourceLoadingStage.subscriptions stage |> Sub.map SourceLoadingStageMsg

            Finished ->
                Sub.none

            FixerStage stage ->
                Fixer.subscriptions stage |> Sub.map FixerMsg
        ]
