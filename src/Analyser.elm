module Analyser exposing (main)

import Analyser.InterfaceLoadingStage as InterfaceLoadingStage
import Analyser.SourceLoadingStage as SourceLoadingStage
import AnalyserPorts
import Platform exposing (programWithFlags)
import Inspection
import Analyser.Dependencies exposing (Dependency, Version)
import Analyser.State as State exposing (State)
import Analyser.Fixer as Fixer
import Tuple2


type alias Flags =
    { interfaceFiles : List ( String, Version )
    , sourceFiles : InputFiles
    }


type alias InputFiles =
    List String


type Msg
    = InterfaceLoadingStageMsg InterfaceLoadingStage.Msg
    | SourceLoadingStageMsg SourceLoadingStage.Msg
    | Reset
    | OnFixMessage Int
    | FixerMsg Fixer.Msg


type alias Model =
    { dependencies : List Dependency
    , flags : Flags
    , stage : Stage
    , state : State
    }


type Stage
    = InterfaceLoadingStage InterfaceLoadingStage.Model
    | SourceLoadingStage SourceLoadingStage.Model
    | FixerStage Fixer.Model
    | Finished


main : Program Flags Model Msg
main =
    programWithFlags { init = init, update = update, subscriptions = subscriptions }


init : Flags -> ( Model, Cmd Msg )
init flags =
    reset
        { flags = flags
        , stage = Finished
        , dependencies = []
        , state = State.initialState
        }


reset : Model -> ( Model, Cmd Msg )
reset ({ flags } as model) =
    let
        ( stage, cmds ) =
            InterfaceLoadingStage.init flags.interfaceFiles
    in
        ( { model
            | stage = InterfaceLoadingStage stage
            , state = State.initialState
            , dependencies = []
          }
        , Cmd.map InterfaceLoadingStageMsg cmds
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
            reset model

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
        if newFixerModel.done then
            let
                _ =
                    Debug.log "Touched files: " newFixerModel.touchedFiles
            in
                --TODO What to do with the checking and the state
                startSourceLoading newFixerModel.touchedFiles
                    ( model, fixerCmds )
        else
            ( { model | stage = FixerStage newFixerModel }
            , fixerCmds
            )


startSourceLoading : List String -> ( Model, Cmd Msg ) -> ( Model, Cmd Msg )
startSourceLoading files ( model, cmds ) =
    let
        ( nextStage, sourceCmds ) =
            SourceLoadingStage.init files
    in
        ( { model | stage = SourceLoadingStage nextStage }
        , Cmd.batch [ Cmd.map SourceLoadingStageMsg sourceCmds, cmds ]
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
                            input

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
                |> startSourceLoading model.flags.sourceFiles
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
                    Inspection.run (SourceLoadingStage.parsedFiles newStage) model.dependencies

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
            InterfaceLoadingStage stage ->
                InterfaceLoadingStage.subscriptions stage |> Sub.map InterfaceLoadingStageMsg

            SourceLoadingStage stage ->
                SourceLoadingStage.subscriptions stage |> Sub.map SourceLoadingStageMsg

            Finished ->
                Sub.none

            FixerStage stage ->
                Fixer.subscriptions stage |> Sub.map FixerMsg
        ]
