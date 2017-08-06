module GraphBuilder exposing (run)

import Analyser.CodeBase exposing (CodeBase)
import Analyser.FileContext as FileContext exposing (FileContext)
import Analyser.Files.Types exposing (LoadedSourceFiles)
import Dict
import Graph exposing (Edge, Node)
import ModuleGraph exposing (ModuleGraph)


run : CodeBase -> LoadedSourceFiles -> ModuleGraph
run codeBase sources =
    let
        files =
            FileContext.build codeBase sources

        moduleNames =
            List.filterMap .moduleName files

        nodes =
            moduleNames |> List.indexedMap (\n x -> Node n x)

        indexedModuleNames =
            nodes |> List.map (\{ id, label } -> ( String.join "." label, id )) |> Dict.fromList

        edges =
            List.concatMap (edgesInFile indexedModuleNames) files
    in
    Graph.fromNodesAndEdges nodes edges


edgesInFile : Dict.Dict String Int -> FileContext -> List (Edge (List String))
edgesInFile moduleIndex file =
    case file.moduleName |> Maybe.andThen (String.join "." >> flip Dict.get moduleIndex) of
        Just fromModule ->
            file.ast.imports
                |> List.filterMap (.moduleName >> String.join "." >> flip Dict.get moduleIndex)
                |> List.map (\x -> Edge fromModule x (file.moduleName |> Maybe.withDefault []))

        Nothing ->
            []
