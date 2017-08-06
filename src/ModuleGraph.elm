module ModuleGraph exposing (..)

import Graph exposing (Graph)
import Graph.Json
import Json.Decode as JD exposing (Decoder)
import Json.Encode as JE exposing (Value)


type alias ModuleGraph =
    Graph (List String) (List String)


decode : Decoder ModuleGraph
decode =
    Graph.Json.decode (JD.list JD.string) (JD.list JD.string)


encode : ModuleGraph -> Value
encode =
    Graph.Json.encode (List.map JE.string >> JE.list) (List.map JE.string >> JE.list)


empty : ModuleGraph
empty =
    Graph.empty
