module Client.Graph.Table exposing (view)

import Client.Graph.Node as Node
import Client.View as View
import Dict exposing (Dict)
import Graph exposing (Graph)
import Graph.Degree as Degree exposing (Degree)
import Graph.Node as Node exposing (Node)
import Html exposing (Html)
import Html.Attributes as Html


{-| Provides a list view showing the `count` top imported and importing modules.
-}
view : Int -> Graph Node -> Html msg
view count graph =
    if List.isEmpty graph.nodes then
        Html.text ""
    else
        topListInAndOut count graph


topListInAndOut : Int -> Graph Node -> Html msg
topListInAndOut count graph =
    let
        topDegrees =
            Degree.topDegrees graph

        nodesDict =
            Node.dictFromList graph.nodes
    in
        Html.div []
            [ View.panel "Top importees" (topList nodesDict (List.take count topDegrees.incoming))
            , View.panel "Top importers" (topList nodesDict (List.take count topDegrees.outgoing))
            ]


topList : Dict Node.Identifier Node -> List ( Node.Identifier, Degree.InOut Degree ) -> Html msg
topList nodesDict list =
    Html.table [ Html.class "table" ]
        [ Html.thead []
            [ Html.tr []
                [ Html.th [] [ Html.text "Module" ]
                , Html.th [] [ Html.text "Imported by" ]
                , Html.th [] [ Html.text "Importing" ]
                ]
            ]
        , Html.tbody []
            (List.map
                (\( identifier, degrees ) ->
                    let
                        node =
                            Dict.get identifier nodesDict

                        nameString =
                            Maybe.map .name node
                                |> Maybe.map Node.nameToString
                                |> Maybe.withDefault identifier
                    in
                        Html.tr []
                            [ Html.td [] [ Html.text nameString ]
                            , Html.td [] [ Html.text (toString degrees.incoming) ]
                            , Html.td [] [ Html.text (toString degrees.outgoing) ]
                            ]
                )
                list
            )
        ]
