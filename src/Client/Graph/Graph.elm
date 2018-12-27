module Client.Graph.Graph exposing
    ( Model
    , init
    , onNewState
    , view
    )

import Client.Graph.Table as Table
import Client.Graph.Widgets as Widgets
import Client.GraphBuilder
import Client.State
import Graph
import Graph.DOT
import Html exposing (Html)
import Html.Attributes as Html
import Html.Lazy
import ModuleGraph exposing (ModuleGraph)


type Model
    = Model (Maybe ModuleGraph)


init : Client.State.State -> Model
init state =
    state
        |> Client.State.toMaybe
        |> Maybe.map (.modules >> Client.GraphBuilder.run)
        |> Model


onNewState : Client.State.State -> Model -> Model
onNewState state _ =
    init state


view : Client.State.State -> Model -> Html msg
view s (Model g) =
    Client.State.view s <|
        \_ ->
            case g of
                Nothing ->
                    Html.div [] []

                Just graph ->
                    Html.div []
                        [ Html.h3 [] [ Html.text "Modules" ]
                        , Html.div [ Html.class "row" ]
                            (widgets graph)
                        , Html.div [ Html.class "row" ]
                            [ Html.Lazy.lazy (Table.view 20) graph
                            ]
                        , Html.div [ Html.class "row" ]
                            [ Html.h2 [] [ Html.text "DOT file" ]
                            , Html.pre []
                                [ Html.text (Graph.DOT.output (Just << .text) (Just << .text) graph) ]
                            ]
                        ]


widgets : ModuleGraph -> List (Html msg)
widgets graph =
    [ Widgets.countModules (Graph.nodes graph)
    , Widgets.countImports (Graph.edges graph)
    ]
