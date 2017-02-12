module Analyser exposing (main)

import Analyser.InterfaceLoadingStage as InterfaceLoadingStage
import Analyser.Messages.Types exposing (Message)
import Analyser.SourceLoadingStage as SourceLoadingStage
import AnalyserPorts
import Platform exposing (programWithFlags)
import Task
import Time exposing (Time)
import Inspection
import Analyser.Dependencies exposing (Dependency, Version)


type alias Flags =
    { interfaceFiles : List ( String, Version )
    , sourceFiles : InputFiles
    }


type alias InputFiles =
    List String


type Msg
    = InterfaceLoadingStageMsg InterfaceLoadingStage.Msg
    | SourceLoadingStageMsg SourceLoadingStage.Msg
    | Now Time
    | Reset
    | OnFixMessage Int


type alias Model =
    { dependencies : List Dependency
    , flags : Flags
    , messages : List Message
    , stage : Stage
    , idCount : Int
    , tasks : List Task
    }


type Task
    = FixMessage Int


type Stage
    = InterfaceLoadingStage InterfaceLoadingStage.Model
    | SourceLoadingStage SourceLoadingStage.Model (List Dependency)
    | Finished (List Message)


main : Program Flags Model Msg
main =
    programWithFlags { init = init, update = update, subscriptions = subscriptions }


init : Flags -> ( Model, Cmd Msg )
init flags =
    reset
        { flags = flags
        , stage = Finished []
        , messages = []
        , dependencies = []
        , idCount = 0
        , tasks = []
        }


reset : Model -> ( Model, Cmd Msg )
reset ({ flags } as model) =
    let
        ( stage, cmds ) =
            InterfaceLoadingStage.init flags.interfaceFiles
    in
        ( { model
            | stage = InterfaceLoadingStage stage
            , dependencies = []
          }
        , Cmd.map InterfaceLoadingStageMsg cmds
        )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case ( msg, model.stage ) of
        ( OnFixMessage messageId, _ ) ->
            ( { model | tasks = model.tasks ++ [ Debug.log "YEAH" <| FixMessage messageId ] }
            , Cmd.none
            )

        ( Reset, _ ) ->
            reset model

        ( InterfaceLoadingStageMsg x, InterfaceLoadingStage stage ) ->
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

        ( SourceLoadingStageMsg x, SourceLoadingStage stage loadedDependencies ) ->
            let
                ( newStage, cmds ) =
                    SourceLoadingStage.update x stage

                messages =
                    Inspection.run (SourceLoadingStage.parsedFiles newStage) loadedDependencies

                messagesWithId =
                    List.indexedMap (\n message -> { message | id = n + model.idCount }) messages
            in
                if SourceLoadingStage.isDone newStage then
                    ( { model
                        | stage = Finished <| messagesWithId
                        , idCount = model.idCount + List.length messages
                      }
                    , Time.now |> Task.perform Now
                    )
                else
                    ( { model | stage = SourceLoadingStage newStage loadedDependencies }
                    , Cmd.map SourceLoadingStageMsg cmds
                    )

        ( message, Finished messages ) ->
            let
                _ =
                    Debug.log "Message " message
            in
                model
                    ! [ AnalyserPorts.sendMessagesAsStrings messages
                      , AnalyserPorts.sendMessagesAsJson messages
                      ]

        _ ->
            model ! []


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

            Finished _ ->
                Sub.none
        ]
