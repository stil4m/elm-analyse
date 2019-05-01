module Analyser.SourceLoadingStage exposing (Model, Msg, init, initWithContent, isDone, parsedFiles, subscriptions, update)

import Analyser.Files.FileContent exposing (FileContent)
import Analyser.Files.FileLoader as FileLoader
import Analyser.Files.Types exposing (LoadedSourceFile, LoadedSourceFiles)
import List.Extra
import Set exposing (Set)


type Model
    = Model State


type Msg
    = FileLoaderMsg String FileLoader.Msg


type alias State =
    { filesToLoad : List String
    , loadingFiles : Set String
    , parsedFiles : List LoadedSourceFile
    }


init : List String -> ( Model, Cmd Msg )
init input =
    ( Model
        { filesToLoad = input
        , loadingFiles = Set.empty
        , parsedFiles = []
        }
    , Cmd.none
    )
        |> loadNextFile


initWithContent : FileContent -> ( Model, Cmd Msg )
initWithContent input =
    let
        ( loadedSourceFile, cmds ) =
            FileLoader.load input
    in
    ( Model
        { filesToLoad = []
        , loadingFiles = Set.empty
        , parsedFiles = [ loadedSourceFile ]
        }
    , cmds
    )


isDone : Model -> Bool
isDone (Model model) =
    List.isEmpty model.filesToLoad && Set.isEmpty model.loadingFiles


parsedFiles : Model -> LoadedSourceFiles
parsedFiles (Model model) =
    model.parsedFiles


update : Msg -> Model -> ( Model, Cmd Msg )
update msg (Model state) =
    case msg of
        FileLoaderMsg name subMsg ->
            let
                ( fileLoad, cmd ) =
                    FileLoader.update subMsg
            in
            ( Model
                { state
                    | loadingFiles = Set.remove name state.loadingFiles
                    , parsedFiles = fileLoad :: state.parsedFiles
                }
            , Cmd.map (FileLoaderMsg name) cmd
            )
                |> loadNextFile


loadNextFile : ( Model, Cmd Msg ) -> ( Model, Cmd Msg )
loadNextFile ( Model model, msgs ) =
    List.Extra.uncons model.filesToLoad
        |> Maybe.map
            (\( next, rest ) ->
                ( Model { model | loadingFiles = Set.insert next model.loadingFiles, filesToLoad = rest }
                , Cmd.batch [ msgs, Cmd.map (FileLoaderMsg next) <| FileLoader.init next ]
                )
            )
        |> Maybe.withDefault ( Model model, msgs )


subscriptions : Model -> Sub Msg
subscriptions (Model model) =
    Set.toList model.loadingFiles
        |> List.map (\n -> FileLoader.subscriptions |> Sub.map (FileLoaderMsg n))
        |> Sub.batch
