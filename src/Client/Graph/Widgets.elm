module Client.Graph.Widgets exposing (countImports, countModules)

import Graph.Edge exposing (Edge)
import Graph.Node exposing (Node)
import Html exposing (Html)
import Html.Attributes as Html


countImports : List Edge -> Html msg
countImports edges =
    List.length edges
        |> widget "Total imports" "fa-arrow-circle-o-down" "green"


countModules : List Node -> Html msg
countModules nodes =
    List.length nodes
        |> widget "Total modules" "fa-cube" "green"


widget : String -> String -> String -> a -> Html msg
widget title icon color value =
    Html.div [ Html.class "col-lg-3 col-md-6" ]
        [ Html.div [ Html.class ("panel panel-" ++ color) ]
            [ Html.div [ Html.class "panel-heading" ]
                [ Html.div [ Html.class "row" ]
                    [ Html.div [ Html.class "col-xs-3" ]
                        [ Html.i [ Html.class ("fa fa-5x " ++ icon) ]
                            []
                        ]
                    , Html.div [ Html.class "col-xs-9 text-right" ]
                        [ Html.div [ Html.class "huge" ]
                            [ Html.text (toString value) ]
                        , Html.div []
                            [ Html.text title ]
                        ]
                    ]
                ]
            ]
        ]
