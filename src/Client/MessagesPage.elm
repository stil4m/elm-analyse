module Client.MessagesPage exposing (Model, Msg, init, subscriptions, update, view)

import Analyser.Messages.Types exposing (GroupedMessages, groupByFileName, groupByType)
import Analyser.State as State exposing (State)
import Client.Components.MessageList as MessageList
import Client.LoadingScreen as LoadingScreen
import Client.Socket exposing (dashboardAddress)
import Dict
import Html exposing (Html, button, div, h3, text)
import Html.Attributes exposing (class, classList, type_)
import Html.Events exposing (onClick)
import Json.Decode as JD
import Navigation exposing (Location)
import RemoteData as RD exposing (RemoteData)
import Time
import WebSocket as WS


type alias Model =
    { state : RemoteData String State
    , messageList : MessageList.Model
    , messageGrouper : MessageGrouper
    }


type Msg
    = NewMsg (Result String State)
    | Tick
    | MessageListMsg MessageList.Msg
    | GroupBy MessageGrouper


type MessageGrouper
    = GroupByFileName
    | GroupByType


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
      , messageList = MessageList.init Dict.empty
      , messageGrouper = GroupByFileName
      }
    , WS.send (dashboardAddress location) "ping"
    )


groupMessages : Model -> GroupedMessages
groupMessages m =
    case m.state of
        RD.Success state ->
            case m.messageGrouper of
                GroupByFileName ->
                    groupByFileName state.messages

                GroupByType ->
                    groupByType state.messages

        _ ->
            Dict.empty


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
                        , messageList = MessageList.withMessages (groupMessages model) model.messageList
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

        GroupBy messageGrouper ->
            let
                newModel =
                    { model | messageGrouper = messageGrouper }
            in
            ( { newModel | messageList = MessageList.withMessages (groupMessages newModel) model.messageList }, Cmd.none )


view : Model -> Html Msg
view m =
    LoadingScreen.viewStateFromRemoteData m.state <|
        \_ ->
            div []
                [ div [ class "clearfix" ]
                    [ h3 [ class "pull-left" ] [ text "Messages" ]
                    , div [ class "btn-group pull-right margin-top" ]
                        [ button
                            [ type_ "button"
                            , class "btn btn-default"
                            , classList [ ( "active", m.messageGrouper == GroupByFileName ) ]
                            , onClick (GroupBy GroupByFileName)
                            ]
                            [ text "Group by file" ]
                        , button
                            [ type_ "button"
                            , class "btn btn-default"
                            , classList [ ( "active", m.messageGrouper == GroupByType ) ]
                            , onClick (GroupBy GroupByType)
                            ]
                            [ text "Group by type" ]
                        ]
                    ]
                , MessageList.view m.messageList |> Html.map MessageListMsg
                ]
