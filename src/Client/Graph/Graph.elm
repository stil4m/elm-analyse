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
import Client.LoadingScreen as LoadingScreen
import Client.Socket exposing (dashboardAddress)
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
    Html.div []
        [ LoadingScreen.viewStateFromMaybe m.state (\_ -> Html.text "")
        , Html.div [ Html.id graphElementId ] []
        , legend m.filter m.colors
        , Maybe.map (.graph >> Html.Lazy.lazy (Table.view 20)) m.state
            |> Maybe.withDefault (Html.text "")
        ]


legend : Filter -> ColorDict -> Html Msg
legend filter colors =
    let
        names =
            Dict.keys colors
                |> List.sort

        entries =
            List.filterMap (legendEntry colors) names

        clearButton =
            if List.isEmpty filter then
                Html.text ""
            else
                Html.button [ Html.class "btn btn-default", onClick (SetFilter []) ] [ Html.text "Reset Filter" ]
    in
        Html.div [ Html.class "graph__legend" ]
            [ clearButton
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
