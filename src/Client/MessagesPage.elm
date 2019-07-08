module Client.MessagesPage exposing (Model, Msg, init, onNewState, update, view)

import Analyser.Messages.Grouped as Grouped exposing (GroupedMessages)
import Client.Components.MessageList as MessageList
import Client.LoadingScreen as LoadingScreen
import Client.State exposing (State)
import Html exposing (Html, button, div, h3, text)
import Html.Attributes exposing (class, classList, type_)
import Html.Events exposing (onClick)
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


init : State -> Model
init state =
    { messageList = buildMessageList state GroupByFileName (MessageList.init (Grouped.byFileName []))
    , messageGrouper = GroupByFileName
    }


onNewState : Client.State.State -> Model -> Model
onNewState s model =
    { model | messageList = buildMessageList s model.messageGrouper model.messageList }


groupMessages : State -> MessageGrouper -> GroupedMessages
groupMessages s m =
    s
        |> RD.map
            (\state ->
                case m of
                    GroupByFileName ->
                        Grouped.byFileName state.messages

                    GroupByType ->
                        Grouped.byType state.messages
            )
        |> RD.withDefault (Grouped.byFileName [])


buildMessageList : State -> MessageGrouper -> MessageList.Model -> MessageList.Model
buildMessageList s grouper old =
    MessageList.withMessages (groupMessages s grouper) old


update : State -> Msg -> Model -> ( Model, Cmd Msg )
update state msg model =
    case msg of
        MessageListMsg subMsg ->
            MessageList.update subMsg model.messageList
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
