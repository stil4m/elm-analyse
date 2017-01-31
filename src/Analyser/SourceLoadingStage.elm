module Analyser.SourceLoadingStage exposing (init, update, isDone, parsedFiles, Model, Msg, subscriptions)

import AST.Types
import AST.Util as Util
import Analyser.Types exposing (FileContent, FileLoad, LoadedFile)
import AnalyserPorts
import Interfaces.Interface as Interface
import List.Extra
import Parser.Parser as Parser


type Model
    = Model State


type Msg
    = OnFileContent FileContent


type alias State =
    { filesToLoad : Maybe ( String, List String )
    , parsedFiles : List LoadedFile
    }


init : List String -> ( Model, Cmd Msg )
init input =
    Model
        { filesToLoad = List.Extra.uncons input
        , parsedFiles = []
        }
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
        OnFileContent fileContent ->
            state.filesToLoad
                |> Maybe.map
                    (\( _, rest ) ->
                        Model
                            { state
                                | filesToLoad = List.Extra.uncons rest
                                , parsedFiles =
                                    onInputLoadingInterface fileContent
                                        :: state.parsedFiles
                            }
                    )
                |> Maybe.map loadNextFile
                |> Maybe.withDefault (Model state ! [])


onInputLoadingInterface : FileContent -> LoadedFile
onInputLoadingInterface fileContent =
    let
        loadedInterfaceForFile : AST.Types.File -> FileLoad
        loadedInterfaceForFile file =
            Analyser.Types.Loaded { ast = file, moduleName = Util.fileModuleName file, interface = Interface.build file }
    in
        case fileContent.content of
            Just content ->
                ( fileContent
                , Parser.parse content
                    |> Maybe.map loadedInterfaceForFile
                    |> Maybe.withDefault Analyser.Types.Failed
                )

            Nothing ->
                ( fileContent
                , Analyser.Types.Failed
                )


loadNextFile : Model -> ( Model, Cmd Msg )
loadNextFile (Model model) =
    model.filesToLoad
        |> Maybe.map
            (\( next, _ ) ->
                ( Model model
                , AnalyserPorts.loadFile next
                )
            )
        |> Maybe.withDefault (Model model ! [])


subscriptions : Model -> Sub Msg
subscriptions _ =
    AnalyserPorts.fileContent OnFileContent
