module Graph.Node exposing (Node, Identifier, decode, encode)

import Json.Encode as JE exposing (Value)
import Json.Decode as JD exposing (Decoder)
import Json.Decode.Extra exposing ((|:))


type alias Identifier =
    String


{-| Describes a node in a graph.
-}
type alias Node =
    { identifier : Identifier
    , name : List String
    }


decode : Decoder Node
decode =
    JD.succeed Node
        |: JD.field "identifier" JD.string
        |: JD.field "name" (JD.list JD.string)


encode : Node -> Value
encode record =
    JE.object
        [ ( "identifier", JE.string record.identifier )
        , ( "name", JE.list (List.map JE.string record.name) )
        ]
