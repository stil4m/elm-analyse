module Client.Graph.Widgets exposing (countImports, countModules)

import Client.View.Widget as Widget
import Html exposing (Html)


countImports : List a -> Html msg
countImports edges =
    List.length edges
        |> Widget.view Widget.Success "Total imports" "fa-arrow-circle-o-down"


countModules : List a -> Html msg
countModules nodes =
    List.length nodes
        |> Widget.view Widget.Success "Total modules" "fa-cube"
