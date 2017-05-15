module GraphBuilder exposing (run)

import Analyser.FileContext as FileContext exposing (FileContext)
import Analyser.Files.Types exposing (LoadedSourceFiles)
import Graph exposing (Graph)
import Graph.Edge as Edge exposing (Edge)
import Graph.Node as Node exposing (Node)
import Set
import Analyser.CodeBase exposing (CodeBase)


run : CodeBase -> LoadedSourceFiles -> Graph Node
run codeBase sources =
    let
        files =
            FileContext.build codeBase sources

        moduleNames =
            List.filterMap .moduleName files

        nodes =
            List.map Node.fromName moduleNames

        identifiers =
            List.map .identifier nodes
                |> Set.fromList

        allEdges =
            List.map edgesInFile files
                |> List.concat

        {-
           Edges to external nodes (i.e. dependencies outside of the scope of
           this app, such as Core and external packages) must be filtered out
           in order to create a valid graph (as these dependencies are not
           represented in the files and hence are missing from the nodes).
        -}
        edges =
            Edge.filterForIdentifiers identifiers allEdges
    in
        Graph.init edges nodes


edgesInFile : FileContext -> List Edge
edgesInFile file =
    case file.moduleName of
        Just fromModule ->
            let
                from =
                    Node.identifierFromName fromModule

                imports =
                    file.ast.imports
                        |> List.map .moduleName
                        |> List.map Node.identifierFromName
            in
                List.map (\to -> Edge from to) imports

        Nothing ->
            []
