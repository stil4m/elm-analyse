module Analyser exposing (..)

import Analyser.InterfaceLoadingStage as InterfaceLoadingStage
import Analyser.Types exposing (LoadedDependencies)
import Platform exposing (program, programWithFlags)


type alias Flags =
    { interfaceFiles : InputInterfaces
    , sourceFiles : InputFiles
    }


type alias InputFiles =
    List String


type alias InputInterfaces =
    List ( String, InputFiles )


type Msg
    = InterfaceLoadingStageMsg InterfaceLoadingStage.Msg


type alias Model =
    { interfaceFiles : InputInterfaces
    , sourceFiles : InputFiles
    , stage : Stage
    }


type Stage
    = InterfaceLoadingStage InterfaceLoadingStage.Model
    | Finished LoadedDependencies


main : Program Flags Model Msg
main =
    programWithFlags { init = init, update = update, subscriptions = subscriptions }


init : Flags -> ( Model, Cmd Msg )
init { interfaceFiles, sourceFiles } =
    let
        ( stage, cmds ) =
            InterfaceLoadingStage.init interfaceFiles
    in
        ( { interfaceFiles = interfaceFiles
          , sourceFiles = sourceFiles
          , stage = InterfaceLoadingStage stage
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
                    { model | stage = Finished (InterfaceLoadingStage.parsedInterfaces newStage) } ! []
                else
                    ( { model | stage = InterfaceLoadingStage newStage }
                    , Cmd.map InterfaceLoadingStageMsg cmds
                    )

        ( _, Finished x ) ->
            let
                _ =
                    Debug.log "Interfaces" x
            in
                model ! []



-- ( _, _ ) ->
-- Debug.log "model" model ! []


subscriptions : Model -> Sub Msg
subscriptions model =
    case model.stage of
        InterfaceLoadingStage state ->
            InterfaceLoadingStage.subscriptions state |> Sub.map InterfaceLoadingStageMsg

        Finished _ ->
            Sub.none
