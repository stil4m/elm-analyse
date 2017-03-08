module Graph.GraphViz exposing (string)

{-| Exports a Graph in GraphViz format.

@see http://www.graphviz.org
-}

import Graph exposing (Graph)
import Graph.Edge as Edge exposing (Edge)
import Graph.Node exposing (Node)
import Set


string : Graph -> String
string graph =
    let
        identifiers =
            -- external node are not correctly rendered by GraphViz
            -- (we exclude them below)
            List.map .identifier graph.nodes
                |> Set.fromList

        edgesString =
            Edge.filterForIdentifiers identifiers graph.edges
                |> List.map edge
                |> String.join "\n"

        nodesString =
            List.map node graph.nodes
                |> String.join "\n"
    in
        "digraph G { rankdir=TB \n" ++ nodesString ++ edgesString ++ "} "


edge : Edge -> String
edge { from, to } =
    toString from ++ " -> " ++ toString to ++ ";"


style : Node -> String
style node =
    let
        numNameElements =
            List.length node.name
    in
        if numNameElements == 1 then
            "style=\"bold, filled\" fillColor=\"#ddd\""
        else if numNameElements <= 2 then
            "style=bold"
        else if numNameElements <= 3 then
            "style=solid"
        else if numNameElements <= 5 then
            "style=dashed"
        else
            "style=dotted"


node : Node -> String
node node =
    -- wrapp string in quotes
    toString node.identifier
        ++ " [shape=box "
        ++ style node
        ++ " label=\""
        ++ String.join "." node.name
        ++ "\"];"
