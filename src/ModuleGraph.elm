module ModuleGraph exposing (ModuleGraph, Node, nodeFromModuleName)

import Graph exposing (Graph)


type alias ModuleGraph =
    Graph Node Node


type alias Node =
    { text : String
    , moduleName : List String
    }


nodeFromModuleName : List String -> Node
nodeFromModuleName x =
    { text = String.join "." x, moduleName = x }
