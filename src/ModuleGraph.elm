module ModuleGraph exposing (..)

import Graph exposing (Graph)
import Graph.Json
import Json.Decode as JD exposing (Decoder)
import Json.Encode as JE exposing (Value)


type alias ModuleGraph =
    Graph Node Node


type alias Node =
    { text : String
    , moduleName : List String
    }


nodeFromModuleName : List String -> Node
nodeFromModuleName x =
    { text = String.join "." x, moduleName = x }


decodeNode : Decoder Node
decodeNode =
    JD.list JD.string |> JD.map nodeFromModuleName


encodeNode : Node -> Value
encodeNode =
    .moduleName >> List.map JE.string >> JE.list


decode : Decoder ModuleGraph
decode =
    Graph.Json.decode decodeNode decodeNode


encode : ModuleGraph -> Value
encode =
    Graph.Json.encode encodeNode encodeNode


empty : ModuleGraph
empty =
    Graph.empty
