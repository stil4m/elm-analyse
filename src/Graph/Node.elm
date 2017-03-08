module Graph.Node exposing (Node, Identifier, decode, encode)

import Graph.Color exposing (Color)
import Json.Encode as JE exposing (Value)
import Json.Decode as JD exposing (Decoder)
import Json.Decode.Extra exposing ((|:))


type alias Identifier =
    String


{-| Describes a node in a graph.
-}
type alias Node =
    { color : Color
    , identifier : Identifier
    , name : List String
    }


decode : Decoder Node
decode =
    JD.succeed Node
        |: JD.field "color" JD.string
        |: JD.field "id" JD.string
        |: JD.field "name" (JD.list JD.string)


encode : Node -> Value
encode record =
    JE.object
        [ ( "color", JE.string record.color )
        , ( "id", JE.string record.identifier )
        , ( "name", JE.list (List.map JE.string record.name) )
        ]
