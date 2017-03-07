module Graph.Edge exposing (Edge, decode, encode, filterForIdentifiers)

import Graph.Node as Node exposing (Node)
import Json.Encode as JE exposing (Value)
import Json.Decode as JD exposing (Decoder)
import Json.Decode.Extra exposing ((|:))
import Set exposing (Set)


{-| Describes the link between two nodes in a Graph.
-}
type alias Edge =
    { from : Node.Identifier
    , to : Node.Identifier
    }


{-| Filter list of edges to only include edges referencing a node in the
given list. This is useful to exclude external nodes.
-}
filterForIdentifiers : Set Node.Identifier -> List Edge -> List Edge
filterForIdentifiers identifiers =
    List.filter
        (\edge ->
            Set.member edge.to identifiers
                && Set.member edge.from identifiers
        )


decode : Decoder Edge
decode =
    JD.succeed Edge
        |: JD.field "from" JD.string
        |: JD.field "to" JD.string


encode : Edge -> Value
encode record =
    JE.object
        [ ( "from", JE.string record.from )
        , ( "to", JE.string record.to )
        ]
