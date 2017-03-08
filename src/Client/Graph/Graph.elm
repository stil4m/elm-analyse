port module Client.Graph.Graph
    exposing
        ( Model
        , Msg
        , init
        , removeCmd
        , subscriptions
        , update
        , view
        , withState
        )

import Analyser.State as State exposing (State)
import Client.Socket exposing (dashboardAddress)
import Graph
import Html exposing (Html, div, text)
import Html.Attributes as Html
import Json.Decode as JD exposing (Value)
import Navigation exposing (Location)
import WebSocket as WS


-- port for sending strings out to JavaScript


port updateGraph : ( String, Value ) -> Cmd msg


port removeGraph : String -> Cmd msg


removeCmd : Cmd msg
removeCmd =
    removeGraph graphElementId


type alias Model =
    { state : Maybe State
    }


type Msg
    = NewState (Result String State)


subscriptions : Location -> Model -> Sub Msg
subscriptions location _ =
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
update _ msg model =
    case msg of
        NewState state ->
            withState (Result.toMaybe state) model ! [ cmdForResult state ]


graphElementId : String
graphElementId =
    "sigmaGraph"


cmdForResult : Result String State -> Cmd Msg
cmdForResult result =
    case result of
        Err _ ->
            Cmd.none

        Ok state ->
            updateGraph ( graphElementId, Graph.encode state.graph )


view : Model -> Html Msg
view m =
    div []
        [ loadingStateLabel m.state
        , div [ Html.id graphElementId ] []
        ]


loadingStateLabel : Maybe State -> Html Msg
loadingStateLabel maybeState =
    case maybeState of
        Nothing ->
            text "Loading..."

        Just state ->
            if State.isBusy state then
                text "Loading..."
            else
                text ""
