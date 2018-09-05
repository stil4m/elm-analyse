module Client.Graph.Table exposing (view)

import Client.View.Panel as Panel
import Graph exposing (NodeContext)
import Html exposing (Html)
import Html.Attributes as Html
import IntDict
import ModuleGraph exposing (ModuleGraph)


{-| Provides a list view showing the `count` top imported and importing modules.
-}
view : Int -> ModuleGraph -> Html msg
view count graph =
    if Graph.isEmpty graph then
        Html.text ""

    else
        topListInAndOut count graph


topListInAndOut : Int -> ModuleGraph -> Html msg
topListInAndOut count graph =
    let
        nodeContexts : List (NodeContext ModuleGraph.Node ModuleGraph.Node)
        nodeContexts =
            Graph.nodes graph
                |> List.filterMap (\x -> Graph.get x.id graph)

        topImportees : List (NodeContext ModuleGraph.Node ModuleGraph.Node)
        topImportees =
            List.sortBy (.incoming >> IntDict.size >> (*) -1) nodeContexts

        topImporters : List (NodeContext ModuleGraph.Node ModuleGraph.Node)
        topImporters =
            List.sortBy (.outgoing >> IntDict.size >> (*) -1) nodeContexts
    in
    Html.div []
        [ Panel.view Panel.WidthHalf
            "Top importees"
            (Panel.documentationButton "top-importees")
            (topList (List.take count topImportees))
        , Panel.view Panel.WidthHalf
            "Top importers"
            (Panel.documentationButton "top-importers")
            (topList (List.take count topImporters))
        ]


topList : List (NodeContext ModuleGraph.Node ModuleGraph.Node) -> Html msg
topList nodeContexts =
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
                (\nodeContext ->
                    Html.tr []
                        [ Html.td [] [ Html.text nodeContext.node.label.text ]
                        , Html.td [] [ Html.text (String.fromInt (IntDict.size nodeContext.incoming)) ]
                        , Html.td [] [ Html.text (String.fromInt (IntDict.size nodeContext.outgoing)) ]
                        ]
                )
                nodeContexts
            )
        ]
