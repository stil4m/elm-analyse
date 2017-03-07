module Graph.Edge exposing (Edge, decode, encode)

import Json.Encode as JE exposing (Value)
import Json.Decode as JD exposing (Decoder)
import Json.Decode.Extra exposing ((|:))


{-| Describes the link between two nodes in a Graph.
-}
type alias Edge =
    { from : String
    , to : String
    }


decode : Decoder Edge
decode =
    JD.succeed Edge
        |: JD.field "from" JD.string
        |: JD.field "to" JD.string


encode : Edge -> Value
encode record =
    JE.object
        [ ( "from", JE.string <| record.from )
        , ( "to", JE.string <| record.to )
        ]
