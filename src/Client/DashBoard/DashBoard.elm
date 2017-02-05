module Client.DashBoard.DashBoard exposing (..)

import Client.DashBoard.State as State exposing (State)
import Html exposing (..)
import Json.Decode as JD
import RemoteData as RD exposing (RemoteData)
import Time
import WebSocket as WS
import Analyser.Messages as Messages exposing (Message)
import Html.Attributes exposing (class, style)


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
    div [ class "container" ]
        [ case m of
            RD.Loading ->
                text "Loading..."

            RD.Success state ->
                viewState state

            RD.Failure x ->
                text "Something went wrong"

            RD.NotAsked ->
                span [] []
        ]


viewState : State -> Html Msg
viewState state =
    div []
        [ h3 [] [ text "Messages" ]
        , ul
            [ style
                [ ( "list-style", "none" )
                , ( "padding", "0" )
                ]
            ]
            (List.indexedMap viewMessage state.messages)
        ]


viewMessage : Int -> Message -> Html Msg
viewMessage n x =
    li
        [ style
            [ ( "margin", "10px" )
            , ( "padding", "10px" )
            , ( "border", "1px solid #ccc" )
            , ( "border-radius", "3px" )
            , ( "backgound", "1px solid #eee" )
            ]
        ]
        [ div [ style [ ( "display", "table-row" ) ] ]
            [ strong [ style [ ( "display", "table-cell" ), ( "padding-right", "20px" ), ( "font-size", "200%" ), ( "vertical-align", "middle" ) ] ]
                [ text <| (++) "#" <| toString <| n + 1 ]
            , span [ style [ ( "display", "table-cell" ) ] ]
                [ text <| Messages.asString x ]
            ]
        ]
