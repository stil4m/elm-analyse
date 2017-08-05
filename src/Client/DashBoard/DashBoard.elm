module Client.DashBoard.DashBoard exposing (Model, Msg, init, subscriptions, update, view)

import Analyser.State as State exposing (State)
import Client.Components.MessageList as MessageList
import Client.LoadingScreen as LoadingScreen
import Client.Socket exposing (dashboardAddress)
import Html exposing (Html, div, h3, text)
import Json.Decode as JD
import Navigation exposing (Location)
import RemoteData as RD exposing (RemoteData)
import Time
import WebSocket as WS


type alias Model =
    { state : RemoteData String State
    , messageList : MessageList.Model
    }


type Msg
    = NewMsg (Result String State)
    | Tick
    | MessageListMsg MessageList.Msg


subscriptions : Location -> Model -> Sub Msg
subscriptions location model =
    Sub.batch
        [ WS.listen (dashboardAddress location) (JD.decodeString State.decodeState >> NewMsg)
        , Time.every (Time.second * 10) (always Tick)
        , MessageList.subscriptions model.messageList |> Sub.map MessageListMsg
        ]


init : Location -> ( Model, Cmd Msg )
init location =
    ( { state = RD.Loading
      , messageList = MessageList.init []
      }
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
            case x of
                Ok o ->
                    ( { model
                        | state = RD.Success o
                        , messageList = MessageList.withMessages o.messages model.messageList
                      }
                    , Cmd.none
                    )

                Err e ->
                    ( { model | state = RD.Failure e }
                    , Cmd.none
                    )

        MessageListMsg subMsg ->
            MessageList.update location subMsg model.messageList
                |> Tuple.mapFirst (\x -> { model | messageList = x })
                |> Tuple.mapSecond (Cmd.map MessageListMsg)


view : Model -> Html Msg
view m =
    LoadingScreen.viewStateFromRemoteData m.state <|
        \_ ->
            div []
                [ h3 [] [ text "Messages" ]
                , MessageList.view m.messageList |> Html.map MessageListMsg
                ]
