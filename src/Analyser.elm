module Analyser exposing (main)

import Analyser.InterfaceLoadingStage as InterfaceLoadingStage
import Analyser.Messages exposing (Message)
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


type alias TargetD =
    List ( String, String )


type Msg
    = InterfaceLoadingStageMsg InterfaceLoadingStage.Msg
    | SourceLoadingStageMsg SourceLoadingStage.Msg
    | Now Time


type alias Model =
    { dependencies : List Dependency
    , sourceFiles : InputFiles
    , messages : List Message
    , stage : Stage
    }


type Stage
    = InterfaceLoadingStage InterfaceLoadingStage.Model
    | SourceLoadingStage SourceLoadingStage.Model (List Dependency)
    | Finished (List Message)


main : Program Flags Model Msg
main =
    programWithFlags { init = init, update = update, subscriptions = subscriptions }


init : Flags -> ( Model, Cmd Msg )
init { interfaceFiles, sourceFiles } =
    let
        ( stage, cmds ) =
            InterfaceLoadingStage.init interfaceFiles
    in
        ( { sourceFiles = sourceFiles
          , stage = InterfaceLoadingStage stage
          , messages = []
          , dependencies = []
          }
        , Cmd.map InterfaceLoadingStageMsg cmds
        )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case ( msg, model.stage ) of
        ( InterfaceLoadingStageMsg x, InterfaceLoadingStage stage ) ->
            let
                ( newStage, cmds ) =
                    InterfaceLoadingStage.update x stage
            in
                if InterfaceLoadingStage.isDone newStage then
                    let
                        ( nextStage, sourceCmds ) =
                            (SourceLoadingStage.init model.sourceFiles)

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
            in
                if SourceLoadingStage.isDone newStage then
                    { model | stage = Finished <| Inspection.run (SourceLoadingStage.parsedFiles newStage) loadedDependencies } ! [ Time.now |> Task.perform Now ]
                else
                    ( { model | stage = SourceLoadingStage newStage loadedDependencies }
                    , Cmd.map SourceLoadingStageMsg cmds
                    )

        ( _, Finished messages ) ->
            model ! [ AnalyserPorts.sendMessagesAsStrings messages ]

        _ ->
            model ! []


subscriptions : Model -> Sub Msg
subscriptions model =
    case model.stage of
        InterfaceLoadingStage stage ->
            InterfaceLoadingStage.subscriptions stage |> Sub.map InterfaceLoadingStageMsg

        SourceLoadingStage stage _ ->
            SourceLoadingStage.subscriptions stage |> Sub.map SourceLoadingStageMsg

        Finished _ ->
            Sub.none
