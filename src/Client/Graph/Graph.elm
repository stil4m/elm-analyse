module Client.Graph.Graph
    exposing
        ( Model
        , init
        , view
        )

import Analyser.State exposing (State)
import Client.Graph.Table as Table
import Client.Graph.Widgets as Widgets
import Client.GraphBuilder
import Graph
import Graph.GraphViz
import Html exposing (Html)
import Html.Attributes as Html
import Html.Lazy
import ModuleGraph exposing (ModuleGraph)


type alias Model =
    ModuleGraph


init : State -> ( Model, Cmd msg )
init state =
    ( Client.GraphBuilder.run state.modules, Cmd.none )


view : Model -> Html msg
view model =
    Html.div []
        [ Html.h3 [] [ Html.text "Modules" ]
        , Html.div [ Html.class "row" ]
            (widgets model)
        , Html.div [ Html.class "row" ]
            [ Html.Lazy.lazy (Table.view 20) model
            ]
        , Html.div [ Html.class "row" ]
            [ Html.h2 [] [ Html.text "DOT file" ]
            , Html.pre []
                [ Html.text (Graph.GraphViz.output model) ]
            ]
        ]


widgets : ModuleGraph -> List (Html msg)
widgets graph =
    [ Widgets.countModules (Graph.nodes graph)
    , Widgets.countImports (Graph.edges graph)
    ]
