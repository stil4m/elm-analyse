module Client.DependenciesPage exposing (..)

import Analyser.State as State exposing (State)
import Client.LoadingScreen as LoadingScreen
import Client.Socket exposing (dashboardAddress)
import Html exposing (Html)
import Json.Decode as JD
import Navigation exposing (Location)
import RemoteData as RD exposing (RemoteData)
import Time
import WebSocket as WS


type alias Model =
    RemoteData String State


type Msg
    = NewMsg (Result String State)
    | Tick


subscriptions : Location -> Model -> Sub Msg
subscriptions location _ =
    Sub.batch
        [ WS.listen (dashboardAddress location) (JD.decodeString State.decodeState >> NewMsg)
        , Time.every (Time.second * 10) (always Tick)
        ]


init : Location -> ( Model, Cmd Msg )
init location =
    ( RD.Loading
    , WS.send (dashboardAddress location) "ping"
    )


update : Location -> Msg -> Model -> ( Model, Cmd Msg )
update location msg model =
    case msg of
        Tick ->
            ( model
            , WS.send (dashboardAddress location) "ping"
            )

        NewMsg x ->
            ( RD.fromResult x, Cmd.none )


view : Model -> Html Msg
view model =
    LoadingScreen.viewStateFromRemoteData model viewState


viewState : State -> Html Msg
viewState state =
    Html.div []
        [ Html.h3 [] [ Html.text "Unused Dependencies" ]
        , if List.isEmpty state.unusedDependencies then
            Html.i []
                [ Html.text "No unused dependencies" ]
          else
            Html.ul [] (List.map (Html.text >> List.singleton >> Html.li []) state.unusedDependencies)
        ]
