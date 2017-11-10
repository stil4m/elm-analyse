module Client.MessagesPage exposing (Model, Msg, init, onNewState, subscriptions, update, view)

import Analyser.Messages.Types exposing (GroupedMessages, groupByFileName, groupByType)
import Client.Components.MessageList as MessageList
import Client.LoadingScreen as LoadingScreen
import Client.State exposing (State)
import Dict
import Html exposing (Html, button, div, h3, text)
import Html.Attributes exposing (class, classList, type_)
import Html.Events exposing (onClick)
import Navigation exposing (Location)
import RemoteData as RD


type alias Model =
    { messageList : MessageList.Model
    , messageGrouper : MessageGrouper
    }


type Msg
    = MessageListMsg MessageList.Msg
    | GroupBy MessageGrouper


type MessageGrouper
    = GroupByFileName
    | GroupByType


subscriptions : Model -> Sub Msg
subscriptions model =
    MessageList.subscriptions model.messageList |> Sub.map MessageListMsg


init : State -> Model
init state =
    { messageList = buildMessageList state GroupByFileName (MessageList.init Dict.empty)
    , messageGrouper = GroupByFileName
    }


onNewState : Client.State.State -> Model -> Model
onNewState s _ =
    init s


groupMessages : State -> MessageGrouper -> GroupedMessages
groupMessages s m =
    s
        |> RD.map
            (\state ->
                case m of
                    GroupByFileName ->
                        groupByFileName state.messages

                    GroupByType ->
                        groupByType state.messages
            )
        |> RD.withDefault Dict.empty


buildMessageList : State -> MessageGrouper -> MessageList.Model -> MessageList.Model
buildMessageList s grouper old =
    MessageList.withMessages (groupMessages s grouper) old


update : State -> Location -> Msg -> Model -> ( Model, Cmd Msg )
update state location msg model =
    case msg of
        MessageListMsg subMsg ->
            MessageList.update location subMsg model.messageList
                |> Tuple.mapFirst (\x -> { model | messageList = x })
                |> Tuple.mapSecond (Cmd.map MessageListMsg)

        GroupBy messageGrouper ->
            ( { model
                | messageGrouper = messageGrouper
                , messageList = buildMessageList state messageGrouper model.messageList
              }
            , Cmd.none
            )


view : State -> Model -> Html Msg
view state m =
    LoadingScreen.viewStateFromRemoteData state <|
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
