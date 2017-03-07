module Graph.GraphViz exposing (string)

{-| Exports a Graph in GraphViz format.

@see http://www.graphviz.org
-}

import Graph exposing (Graph)
import Graph.Edge exposing (Edge)


string : Graph -> String
string graph =
    let
        edgesString =
            List.map edge graph.edges
                |> String.join ""
    in
        "digraph G { rankdir=TB " ++ edgesString ++ "} "


edge : Edge -> String
edge { from, to } =
    toString from ++ " -> " ++ toString to ++ ";\n"
