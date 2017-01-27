module Analyser.SourceLoadingStage exposing (..)

import AST.Types
import AST.Util as Util
import Analyser.Types exposing (FileLoad)
import AnalyserPorts
import Interfaces.Interface as Interface
import List.Extra
import Parser.Parser as Parser


type Model
    = Model State


type Msg
    = OnFileContent ( String, String )


type alias State =
    { filesToLoad : Maybe ( String, List String )
    , parsedFiles : List ( String, FileLoad )
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


insertDependencyInterface :
    ( String, FileLoad )
    -> List ( String, FileLoad )
    -> List ( String, FileLoad )
insertDependencyInterface =
    (::)


parsedFiles : Model -> Analyser.Types.LoadedSourceFiles
parsedFiles (Model model) =
    model.parsedFiles


update : Msg -> Model -> ( Model, Cmd Msg )
update msg (Model state) =
    case msg of
        OnFileContent ( _, content ) ->
            state.filesToLoad
                |> Maybe.map
                    (\( fileName, rest ) ->
                        Model
                            { state
                                | filesToLoad = List.Extra.uncons rest
                                , parsedFiles =
                                    onInputLoadingInterface ( fileName, content )
                                        :: state.parsedFiles
                            }
                    )
                |> Maybe.map loadNextFile
                |> Maybe.withDefault (Model state ! [])


onInputLoadingInterface : ( String, String ) -> ( String, FileLoad )
onInputLoadingInterface ( fileName, content ) =
    let
        loadedInterfaceForFile : AST.Types.File -> FileLoad
        loadedInterfaceForFile file =
            Analyser.Types.Loaded { ast = file, moduleName = Util.fileModuleName file, interface = Interface.build file }
    in
        ( fileName
        , Parser.parse content
            |> Maybe.map loadedInterfaceForFile
            |> Maybe.withDefault Analyser.Types.Failed
        )


loadNextFile : Model -> ( Model, Cmd Msg )
loadNextFile (Model model) =
    model.filesToLoad
        |> Maybe.map
            (\( next, rest ) ->
                ( Model model
                , AnalyserPorts.loadFile next
                )
            )
        |> Maybe.withDefault (Model model ! [])


subscriptions : Model -> Sub Msg
subscriptions model =
    AnalyserPorts.fileContent OnFileContent
