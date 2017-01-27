module Analyser.InterfaceLoadingStage exposing (..)

import AST.Types
import AST.Util as Util
import Analyser.Types exposing (FileLoad)
import Analyser.LoadedDependencies exposing (LoadedDependencies, LoadedInterface)
import AnalyserPorts
import Dict exposing (Dict)
import Interfaces.Interface as Interface
import List.Extra
import Parser.Parser as Parser


type Model
    = Model State


type Msg
    = OnFileContent ( String, String )


type alias State =
    { filesToLoad : Maybe ( ( String, String ), List ( String, String ) )
    , parsedInterfaces : List ( String, ( String, FileLoad ) )
    }


init : List ( String, List String ) -> ( Model, Cmd Msg )
init input =
    let
        x =
            input
                |> List.concatMap (\( dependency, files ) -> List.map ((,) dependency) files)
    in
        Model
            { filesToLoad = List.Extra.uncons x
            , parsedInterfaces = []
            }
            |> loadNextFile


isDone : Model -> Bool
isDone (Model model) =
    model.filesToLoad == Nothing


insertDependencyInterface :
    ( String, ( String, FileLoad ) )
    -> Dict String (List ( String, FileLoad ))
    -> Dict String (List ( String, FileLoad ))
insertDependencyInterface ( name, result ) b =
    Dict.get name b
        |> Maybe.withDefault []
        |> (::) result
        |> flip (Dict.insert name) b


parsedInterfaces : Model -> LoadedDependencies
parsedInterfaces (Model model) =
    model.parsedInterfaces
        |> List.foldr insertDependencyInterface Dict.empty
        |> Dict.toList
        |> List.map (\( k, v ) -> { dependency = k, interfaces = v })


update : Msg -> Model -> ( Model, Cmd Msg )
update msg (Model state) =
    case msg of
        OnFileContent ( _, content ) ->
            state.filesToLoad
                |> Maybe.map
                    (\( ( dependency, fileName ), rest ) ->
                        Model
                            { state
                                | filesToLoad = List.Extra.uncons rest
                                , parsedInterfaces =
                                    onInputLoadingInterface ( dependency, fileName, content )
                                        :: state.parsedInterfaces
                            }
                    )
                |> Maybe.map loadNextFile
                |> Maybe.withDefault (Model state ! [])


onInputLoadingInterface : ( String, String, String ) -> ( String, ( String, FileLoad ) )
onInputLoadingInterface ( dependency, fileName, content ) =
    let
        loadedInterfaceForFile : AST.Types.File -> FileLoad
        loadedInterfaceForFile file =
            Analyser.Types.Loaded { ast = file, moduleName = Util.fileModuleName file, interface = Interface.build file }
    in
        ( dependency
        , ( fileName
          , Parser.parse content
                |> Maybe.map loadedInterfaceForFile
                |> Maybe.withDefault Analyser.Types.Failed
          )
        )


loadNextFile : Model -> ( Model, Cmd Msg )
loadNextFile (Model model) =
    model.filesToLoad
        |> Maybe.map
            (\( next, rest ) ->
                ( Model model
                , AnalyserPorts.loadFile (Tuple.second next)
                )
            )
        |> Maybe.withDefault (Model model ! [])


subscriptions : Model -> Sub Msg
subscriptions model =
    AnalyserPorts.fileContent OnFileContent
