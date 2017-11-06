module Graph.Json exposing (decode, encode)

import Graph exposing (Edge, Graph, Node)
import Json.Decode as JD exposing (Decoder)
import Json.Encode as JE exposing (Value)


decode : Decoder node -> Decoder edge -> Decoder (Graph node edge)
decode nodeDec edgeDec =
    JD.map2 Graph.fromNodesAndEdges
        (JD.field "nodes" (JD.list (decodeNode nodeDec)))
        (JD.field "edges" (JD.list (decodeEdge edgeDec)))


decodeNode : Decoder node -> Decoder (Node node)
decodeNode nodeDec =
    JD.map2 Node
        (JD.field "id" JD.int)
        (JD.field "label" nodeDec)


decodeEdge : Decoder edge -> Decoder (Edge edge)
decodeEdge edgeDec =
    JD.map3 Edge
        (JD.field "from" JD.int)
        (JD.field "to" JD.int)
        (JD.field "label" edgeDec)


encode : (node -> Value) -> (edge -> Value) -> Graph node edge -> JE.Value
encode nodeEnc edgeEnc graph =
    JE.object
        [ ( "nodes", JE.list <| List.map (encodeNode nodeEnc) (Graph.nodes graph) )
        , ( "edges", JE.list <| List.map (encodeEdge edgeEnc) (Graph.edges graph) )
        ]


encodeNode : (node -> Value) -> Node node -> Value
encodeNode enc { id, label } =
    JE.object
        [ ( "id", JE.int id )
        , ( "label", enc label )
        ]


encodeEdge : (edge -> Value) -> Edge edge -> Value
encodeEdge enc { from, to, label } =
    JE.object
        [ ( "from", JE.int from )
        , ( "to", JE.int to )
        , ( "label", enc label )
        ]
