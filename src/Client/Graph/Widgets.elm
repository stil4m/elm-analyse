module Client.Graph.Widgets exposing (countImports, countModules)

import Client.View.Widget as Widget
import Graph exposing (Edge, Node)
import Html exposing (Html)


countImports : List (Edge (List String)) -> Html msg
countImports edges =
    List.length edges
        |> Widget.view Widget.Success "Total imports" "fa-arrow-circle-o-down"


countModules : List (Node (List String)) -> Html msg
countModules nodes =
    List.length nodes
        |> Widget.view Widget.Success "Total modules" "fa-cube"
