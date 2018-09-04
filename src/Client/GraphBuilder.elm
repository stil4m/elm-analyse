module Client.GraphBuilder exposing (run)

import Analyser.Modules exposing (Modules)
import Dict
import Elm.Syntax.ModuleName exposing (ModuleName)
import Graph exposing (Edge, Node)
import ModuleGraph exposing (ModuleGraph)


run : Modules -> ModuleGraph
run m =
    let
        moduleNames =
            m.projectModules

        nodes =
            moduleNames |> List.indexedMap (\n x -> Node n (ModuleGraph.nodeFromModuleName x))

        indexedModuleNames =
            nodes |> List.map (\{ id, label } -> ( label.text, id )) |> Dict.fromList

        edges =
            List.filterMap (edgesInFile indexedModuleNames) m.dependencies
    in
    Graph.fromNodesAndEdges nodes edges


edgesInFile : Dict.Dict String Int -> ( ModuleName, ModuleName ) -> Maybe (Edge ModuleGraph.Node)
edgesInFile moduleIndex ( from, to ) =
    let
        lookup =
            String.join "." >> (\a -> Dict.get a moduleIndex)
    in
    Maybe.map2 (\a b -> ( a, b )) (lookup from) (lookup to)
        |> Maybe.map (\( fromId, toId ) -> Edge fromId toId (ModuleGraph.nodeFromModuleName from))
