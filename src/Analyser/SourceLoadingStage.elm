module Analyser.SourceLoadingStage exposing (init, update, isDone, parsedFiles, Model, Msg, subscriptions)

import Analyser.Types exposing (FileContent, FileLoad, LoadedFile)
import List.Extra
import Analyser.FileLoader as FileLoader


type Model
    = Model State


type Msg
    = FileLoaderMsg FileLoader.Msg


type alias State =
    { filesToLoad : Maybe ( String, List String )
    , parsedFiles : List LoadedFile
    }


init : List String -> ( Model, Cmd Msg )
init input =
    ( Model
        { filesToLoad = List.Extra.uncons input
        , parsedFiles = []
        }
    , Cmd.none
    )
        |> loadNextFile


isDone : Model -> Bool
isDone (Model model) =
    model.filesToLoad == Nothing


parsedFiles : Model -> Analyser.Types.LoadedSourceFiles
parsedFiles (Model model) =
    model.parsedFiles


update : Msg -> Model -> ( Model, Cmd Msg )
update msg (Model state) =
    case msg of
        FileLoaderMsg subMsg ->
            state.filesToLoad
                |> Maybe.map
                    (\( _, rest ) ->
                        let
                            ( fileLoad, cmd ) =
                                FileLoader.update subMsg
                        in
                            ( Model
                                { state
                                    | filesToLoad = List.Extra.uncons rest
                                    , parsedFiles = fileLoad :: state.parsedFiles
                                }
                            , Cmd.map FileLoaderMsg cmd
                            )
                    )
                |> Maybe.map loadNextFile
                |> Maybe.withDefault (Model state ! [])


loadNextFile : ( Model, Cmd Msg ) -> ( Model, Cmd Msg )
loadNextFile ( Model model, msgs ) =
    model.filesToLoad
        |> Maybe.map
            (\( next, _ ) ->
                ( Model model
                , Cmd.batch [ msgs, Cmd.map FileLoaderMsg <| FileLoader.init next ]
                )
            )
        |> Maybe.withDefault ( Model model, msgs )


subscriptions : Model -> Sub Msg
subscriptions _ =
    FileLoader.subscriptions |> Sub.map FileLoaderMsg
