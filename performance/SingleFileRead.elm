module SingleFileRead exposing (..)

import Platform exposing (programWithFlags)
import Time exposing (Time)
import Task
import Analyser.Files.FileLoader as FileLoader
import Analyser.Files.Types exposing (LoadedFile, FileLoad(..))
import Json.Decode as JD
import Json.Encode as JE
import AST.Encoding
import AST.Decoding
import AST.Types exposing (..)


type alias Model =
    { path : String
    , messages : List ( Time, String )
    , serialised : String
    , decoded : Maybe File
    }


type Msg
    = Start Time
    | LoadedFile LoadedFile Time
    | Serialised Time
    | Deserialised Time
    | FileLoaderMsg FileLoader.Msg


main : Program String Model Msg
main =
    programWithFlags { init = init, update = update, subscriptions = subscriptions }


init : String -> ( Model, Cmd Msg )
init path =
    ( { path = path, messages = [], serialised = "", decoded = Nothing }
    , Time.now |> Task.perform Start
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Start x ->
            ( { model | messages = ( x, "Started" ) :: model.messages }
            , FileLoader.init model.path |> Cmd.map FileLoaderMsg
            )

        FileLoaderMsg subMsg ->
            let
                ( x, cmds ) =
                    FileLoader.update subMsg
            in
                ( model
                , Cmd.batch [ cmds, Time.now |> Task.perform (LoadedFile x) ]
                )

        LoadedFile file x ->
            ( { model
                | messages = ( x, "Loaded file" ) :: model.messages
                , serialised =
                    case Tuple.second file of
                        Loaded context ->
                            JE.encode 0 (AST.Encoding.encode context.ast)

                        _ ->
                            ""
              }
            , Time.now |> Task.perform Serialised
            )

        Serialised x ->
            ( { model
                | messages = ( x, "Serialised file" ) :: model.messages
                , decoded =
                    JD.decodeString AST.Decoding.decode model.serialised
                        |> Result.toMaybe
              }
            , Time.now |> Task.perform Deserialised
            )

        Deserialised x ->
            let
                newModel =
                    { model | messages = ( x, "Loaded file" ) :: model.messages }

                result =
                    ( newModel
                    , Cmd.none
                    )

                timePatch =
                    newModel.messages |> List.reverse |> List.head |> Maybe.map Tuple.first |> Maybe.withDefault 0

                realMessages =
                    newModel.messages
                        |> List.map (Tuple.mapFirst (flip (-) timePatch))

                _ =
                    Debug.log "Messages" realMessages

                _ =
                    Debug.log "Decode success?" <| newModel.decoded == Nothing
            in
                result


subscriptions : Model -> Sub Msg
subscriptions _ =
    FileLoader.subscriptions |> Sub.map FileLoaderMsg
