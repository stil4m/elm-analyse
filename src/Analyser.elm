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
    | SourceLoadingStage SourceLoadingStage.Model (List Dependency)
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
                SourceLoadingStage stage loadedDependencies ->
                    onSourceLoadingStageMsg x stage loadedDependencies model

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
            --TODO What to do with the checking and the state
            ( { model | stage = Finished }
            , fixerCmds
            )
        else
            ( { model | stage = FixerStage newFixerModel }
            , fixerCmds
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
                            ( { model
                                | state = newState2
                                , stage = FixerStage fixerModel
                              }
                            , Cmd.batch
                                [ cmds
                                , Cmd.map FixerMsg fixerCmds
                                ]
                            )

        _ ->
            input


onInterfaceLoadingStageMsg : InterfaceLoadingStage.Msg -> InterfaceLoadingStage.Model -> Model -> ( Model, Cmd Msg )
onInterfaceLoadingStageMsg x stage model =
    let
        ( newStage, cmds ) =
            InterfaceLoadingStage.update x stage
    in
        if InterfaceLoadingStage.isDone newStage then
            let
                ( nextStage, sourceCmds ) =
                    (SourceLoadingStage.init model.flags.sourceFiles)

                loadedDependencies =
                    InterfaceLoadingStage.getDependencies newStage
            in
                ( { model
                    | stage = SourceLoadingStage nextStage loadedDependencies
                  }
                , Cmd.batch
                    [ Cmd.map SourceLoadingStageMsg sourceCmds
                    , Cmd.map InterfaceLoadingStageMsg cmds
                    ]
                )
        else
            ( { model | stage = InterfaceLoadingStage newStage }
            , Cmd.map InterfaceLoadingStageMsg cmds
            )


onSourceLoadingStageMsg : SourceLoadingStage.Msg -> SourceLoadingStage.Model -> List Dependency -> Model -> ( Model, Cmd Msg )
onSourceLoadingStageMsg x stage loadedDependencies model =
    let
        ( newStage, cmds ) =
            SourceLoadingStage.update x stage

        messages =
            Inspection.run (SourceLoadingStage.parsedFiles newStage) loadedDependencies

        newState =
            State.finishWithNewMessages messages model.state

        newModel =
            { model
                | stage = Finished
                , state = newState
            }
    in
        if SourceLoadingStage.isDone newStage then
            ( newModel
            , Cmd.batch
                [ AnalyserPorts.sendMessagesAsStrings newState.messages
                , AnalyserPorts.sendMessagesAsJson newState.messages
                , AnalyserPorts.sendStateAsJson newState
                ]
            )
                |> handleNextStep
        else
            ( { model | stage = SourceLoadingStage newStage loadedDependencies }
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

            SourceLoadingStage stage _ ->
                SourceLoadingStage.subscriptions stage |> Sub.map SourceLoadingStageMsg

            Finished ->
                Sub.none

            FixerStage stage ->
                Fixer.subscriptions stage |> Sub.map FixerMsg
        ]
