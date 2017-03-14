port module Client.Graph.Graph
    exposing
        ( Model
        , Msg
        , init
        , removeCmd
        , subscriptions
        , update
        , view
        )

import Analyser.State as State exposing (State)
import Client.Graph.Node as Node
import Client.Graph.Table as Table
import Client.Graph.Widgets as Widgets
import Client.LoadingScreen as LoadingScreen
import Client.Socket exposing (dashboardAddress)
import Client.View.BreadCrumb as BreadCrumb
import Client.View.Panel as Panel
import Dict exposing (Dict)
import Graph exposing (Graph)
import Graph.Colored.Color exposing (ColorDict)
import Graph.Colored.Decorator as GraphDecorator
import Graph.Colored.Graph as ColoredGraph exposing (ColoredGraph)
import Graph.Node as Node exposing (Node)
import Html exposing (Html)
import Html.Attributes as Html
import Html.Events exposing (onClick)
import Html.Lazy
import Json.Decode as JD exposing (Value)
import List.Extra as List
import Navigation exposing (Location)
import WebSocket as WS


-- port for sending strings out to JavaScript


port updateGraph : ( String, Value ) -> Cmd msg


port removeGraph : String -> Cmd msg


removeCmd : Cmd msg
removeCmd =
    removeGraph graphElementId


type alias Filter =
    List String


type alias Model =
    { state : Maybe State
    , graph : Maybe ColoredGraph
    , colors : ColorDict
    , filter : Filter
    }


type Msg
    = NewState (Result String State)
    | SetFilter (List String)


subscriptions : Location -> Model -> Sub Msg
subscriptions location _ =
    Sub.batch [ WS.listen (dashboardAddress location) (JD.decodeString State.decodeState >> NewState) ]


withNewState : State -> Model -> Model
withNewState state m =
    -- Update state, reset filter, and update Graph
    withGraph { m | state = Just state, filter = [] } state.graph


init : Location -> ( Model, Cmd Msg )
init location =
    { state = Nothing, graph = Nothing, colors = Dict.empty, filter = [] }
        ! [ WS.send (dashboardAddress location) "ping" ]


update : Location -> Msg -> Model -> ( Model, Cmd Msg )
update _ msg model =
    case msg of
        NewState newState ->
            case newState of
                Err _ ->
                    model ! []

                Ok state ->
                    let
                        newModel =
                            withNewState state model
                    in
                        newModel ! [ cmdForUpdatedGraph newModel.graph ]

        SetFilter filter ->
            let
                newModelWithFilter =
                    { model | filter = filter }
            in
                case model.state of
                    Nothing ->
                        newModelWithFilter ! []

                    Just state ->
                        let
                            modelWithNewGraph =
                                Graph.filter (\node -> List.take (List.length filter) node.name == filter) state.graph
                                    |> withGraph newModelWithFilter
                        in
                            modelWithNewGraph ! [ cmdForUpdatedGraph modelWithNewGraph.graph ]


graphElementId : String
graphElementId =
    "sigmaGraph"


cmdForUpdatedGraph : Maybe ColoredGraph -> Cmd Msg
cmdForUpdatedGraph maybeGraph =
    case maybeGraph of
        Nothing ->
            Cmd.none

        Just graph ->
            updateGraph ( graphElementId, ColoredGraph.encode graph )


withGraph : Model -> Graph Node -> Model
withGraph model graph =
    let
        ( colors, coloredGraph ) =
            GraphDecorator.coloredGraph (1 + List.length model.filter) graph
    in
        { model | graph = Just coloredGraph, colors = colors }


view : Model -> Html Msg
view m =
    let
        maybeGraph =
            Maybe.map .graph m.state
    in
        Html.div []
            [ LoadingScreen.viewStateFromMaybe m.state (\_ -> Html.text "")
            , Html.h3 [] [ Html.text "Module Graph" ]
            , Html.div [ Html.class "row" ]
                (widgets maybeGraph)
            , Html.div [ Html.class "row" ]
                [ Panel.viewWithFooter Panel.WidthFull
                    "Graph"
                    (Panel.documentationButton "ModuleGraph.md")
                    (Html.div [ Html.id graphElementId ] [])
                    (Just (legend m.filter m.colors))
                ]
            , Html.div [ Html.class "row" ]
                [ Maybe.map (Html.Lazy.lazy (Table.view 20)) maybeGraph
                    |> Maybe.withDefault (Html.text "")
                ]
            ]


widgets : Maybe (Graph Node) -> List (Html msg)
widgets maybeGraph =
    case maybeGraph of
        Just graph ->
            [ Widgets.countModules graph.nodes
            , Widgets.countImports graph.edges
            ]

        Nothing ->
            [ Html.text "" ]


legend : Filter -> ColorDict -> Html Msg
legend filter colors =
    let
        names =
            Dict.keys colors
                |> List.sort

        entries =
            List.filterMap (legendEntry colors) names

        breadCrumb =
            if List.isEmpty filter then
                Html.text ""
            else
                breadCrumbsForFilter filter
                    |> BreadCrumb.view (List.last filter |> Maybe.withDefault "Current Filter")
    in
        Html.div [ Html.class "graph__legend" ]
            [ breadCrumb
            , Html.ul [] entries
            ]


legendEntry : ColorDict -> List String -> Maybe (Html Msg)
legendEntry colors names =
    case Dict.get names colors of
        Just color ->
            Html.li
                [ Html.style [ ( "color", color ) ], onClick (SetFilter names) ]
                [ Html.text (Node.nameToString names) ]
                |> Just

        Nothing ->
            Nothing


breadCrumbsForFilter : Filter -> List (BreadCrumb.Item Msg)
breadCrumbsForFilter filter =
    -- From a filter [A,B,C] build crumbs [[A], [A, B]]
    { title = "All"
    , msg = SetFilter []
    , color = ""
    }
        :: (List.inits filter
                |> -- drop the first (empty) item generated by inits
                   List.drop 1
                |> -- drop the last entry
                   List.take (List.length filter - 1)
                |> List.map breadCrumbItem
           )


breadCrumbItem : List String -> BreadCrumb.Item Msg
breadCrumbItem nodeName =
    { title = List.last nodeName |> Maybe.withDefault ""
    , msg = SetFilter nodeName
    , color = ""
    }
