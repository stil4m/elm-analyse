module Client.DependencyGraph.DependencyGraph exposing (Model, Msg, subscriptions, init, update, view, withState)

import Graph.GraphViz as GraphViz
import Analyser.State as State exposing (State)
import Client.Socket exposing (dashboardAddress)
import Html exposing (Html, a, div, span, text)
import Json.Decode as JD exposing (list, string)
import Navigation exposing (Location)
import WebSocket as WS


type alias Model =
    { state : Maybe State
    }


type Msg
    = NewState (Result String State)


subscriptions : Location -> Model -> Sub Msg
subscriptions location model =
    Sub.batch [ WS.listen (dashboardAddress location) (JD.decodeString State.decodeState >> NewState) ]


withState : Maybe State -> Model -> Model
withState x m =
    { m | state = x }


init : Location -> ( Model, Cmd Msg )
init location =
    { state = Nothing }
        ! [ WS.send (dashboardAddress location) "ping"
          ]


update : Location -> Msg -> Model -> ( Model, Cmd Msg )
update location msg model =
    case msg of
        NewState state ->
            (withState (Result.toMaybe state) model) ! []


view : Model -> Html Msg
view m =
    div []
        [ case m.state of
            Nothing ->
                text "Loading..."

            Just state ->
                if State.isBusy state then
                    text "Loading..."
                else
                    Html.pre [] [ text (GraphViz.string state.graph) ]
        ]
