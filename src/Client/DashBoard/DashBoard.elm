module Client.DashBoard.DashBoard exposing (..)

import Client.DashBoard.State as State exposing (State)
import Html exposing (..)
import Json.Decode as JD
import RemoteData as RD exposing (RemoteData)
import Time
import WebSocket as WS


type alias Model =
    RemoteData String State


type Msg
    = NewMsg (Result String State)
    | Tick


socketAddress : String
socketAddress =
    "ws://localhost:3000/dashboard"


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ WS.listen socketAddress (JD.decodeString State.decodeState >> NewMsg)
        , Time.every (Time.second * 10) (always Tick)
        ]


init : ( Model, Cmd Msg )
init =
    ( RD.Loading, Cmd.none )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Tick ->
            ( model, WS.send socketAddress "ping" )

        NewMsg x ->
            case x of
                Ok o ->
                    RD.Success o ! []

                Err e ->
                    RD.Failure e ! []


view : Model -> Html Msg
view m =
    div []
        [ text <| toString m
        ]
