module Client.DashBoard.DashBoard exposing (Model, Msg, subscriptions, init, update, view)

import Analyser.State as State exposing (State)
import Html exposing (Html, div, text, span, h3)
import Json.Decode as JD
import RemoteData as RD exposing (RemoteData)
import Time
import WebSocket as WS
import Analyser.Messages.Util as Messages
import Tuple2
import Navigation exposing (Location)
import Client.Socket exposing (dashboardAddress)
import Client.MessageList as MessageList


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
        , MessageList.subscriptions location model.messageList |> Sub.map MessageListMsg
        ]


init : Location -> ( Model, Cmd Msg )
init location =
    ( { state = RD.Loading
      , messageList = MessageList.init []
      }
    , WS.send (dashboardAddress location) "ping"
    )


sortMessages : State -> State
sortMessages state =
    { state | messages = List.sortBy (.data >> Messages.getFiles >> List.head >> Maybe.withDefault "") state.messages }


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
                        | state = RD.Success (sortMessages o)
                        , messageList = MessageList.withMessages (sortMessages o).messages model.messageList
                      }
                    , Cmd.none
                    )

                Err e ->
                    ( { model | state = RD.Failure e }
                    , Cmd.none
                    )

        MessageListMsg subMsg ->
            MessageList.update location subMsg model.messageList
                |> Tuple2.mapFirst (\x -> { model | messageList = x })
                |> Tuple2.mapSecond (Cmd.map MessageListMsg)


view : Model -> Html Msg
view m =
    div []
        [ case m.state of
            RD.Loading ->
                text "Loading..."

            RD.Success state ->
                if State.isBusy state then
                    text "Loading..."
                else
                    div []
                        [ h3 [] [ text "Messages" ]
                        , MessageList.view m.messageList |> Html.map MessageListMsg
                        ]

            RD.Failure e ->
                div []
                    [ text "Something went wrong"
                    , text <| toString e
                    ]

            RD.NotAsked ->
                span [] []
        ]
