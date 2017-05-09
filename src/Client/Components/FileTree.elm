module Client.Components.FileTree exposing (Model, Msg, init, subscriptions, update, view)

import Navigation exposing (Location)
import Html exposing (..)
import Html.Attributes exposing (class, style, type_, checked)
import Html.Events exposing (onClick)
import Json.Decode as JD exposing (string, list)
import Analyser.State as State exposing (State)
import Analyser.Messages.Types exposing (Message)
import Http
import WebSocket as WS
import Client.Socket exposing (dashboardAddress)
import Time
import Client.Components.MessageList as MessageList


type alias Model =
    { hideGoodFiles : Bool
    , tree : Maybe (List String)
    , state : Maybe State
    , fileIndex : Maybe FileIndex
    , selectedFile : Maybe String
    , messageList : MessageList.Model
    }


type alias FileIndex =
    List ( String, List Message )


type Msg
    = OnFileTree (Result Http.Error (List String))
    | MessageListMsg MessageList.Msg
    | NewState (Result String State)
    | OnSelectFile String
    | Tick
    | ToggleHideGoodFiles


init : Location -> ( Model, Cmd Msg )
init location =
    ( { tree = Nothing
      , hideGoodFiles = True
      , state = Nothing
      , fileIndex = Nothing
      , selectedFile = Nothing
      , messageList = MessageList.init []
      }
    , Cmd.batch
        [ Http.get "/tree" (list string) |> Http.send OnFileTree
        , WS.send (dashboardAddress location) "ping"
        ]
    )


subscriptions : Location -> Model -> Sub Msg
subscriptions location model =
    Sub.batch
        [ WS.listen (dashboardAddress location) (JD.decodeString State.decodeState >> NewState)
        , Time.every (Time.second * 10) (always Tick)
        , MessageList.subscriptions model.messageList |> Sub.map MessageListMsg
        ]


updateFileIndex : Model -> Model
updateFileIndex model =
    let
        messagesForFile file state =
            state.messages
                |> List.filter
                    (\messages ->
                        List.map Tuple.second messages.files
                            |> List.member file
                    )

        buildTree state tree =
            List.map (\file -> ( file, messagesForFile file state )) tree
    in
        { model | fileIndex = Maybe.map2 buildTree model.state model.tree }


updateMessageList : Model -> Model
updateMessageList m =
    { m | messageList = MessageList.withMessages (messagesForSelectedFile m) m.messageList }


update : Location -> Msg -> Model -> ( Model, Cmd Msg )
update location msg model =
    case msg of
        OnFileTree x ->
            case x of
                Ok value ->
                    ( { model | tree = Just value } |> updateFileIndex
                    , Cmd.none
                    )

                Err _ ->
                    ( model
                    , Cmd.none
                    )

        NewState s ->
            ( { model | state = Result.toMaybe s } |> updateFileIndex |> updateMessageList
            , Cmd.none
            )

        Tick ->
            ( model
            , WS.send (dashboardAddress location) "ping"
            )

        OnSelectFile x ->
            ( { model | selectedFile = Just x } |> updateMessageList, Cmd.none )

        ToggleHideGoodFiles ->
            ( { model | hideGoodFiles = not model.hideGoodFiles }
            , Cmd.none
            )

        MessageListMsg subMsg ->
            MessageList.update location subMsg model.messageList
                |> Tuple.mapFirst (\x -> { model | messageList = x })
                |> Tuple.mapSecond (Cmd.map MessageListMsg)


messagesForSelectedFile : Model -> List Message
messagesForSelectedFile m =
    case m.fileIndex of
        Just fileIndex ->
            fileIndex
                |> List.filter (Tuple.first >> Just >> (==) m.selectedFile)
                |> List.head
                |> Maybe.map Tuple.second
                |> Maybe.withDefault []

        _ ->
            []


view : Model -> Html Msg
view m =
    let
        allowFile ( _, mess ) =
            if m.hideGoodFiles then
                List.length mess > 0
            else
                True

        asItem ( fileName, messages ) =
            a
                [ class "list-group-item", onClick (OnSelectFile fileName) ]
                [ span [ class "badge" ] [ text <| toString (List.length messages) ]
                , text fileName
                ]
    in
        div []
            [ div [ class "checkbox" ]
                [ label []
                    [ input
                        [ type_ "checkbox"
                        , checked m.hideGoodFiles
                        , onClick ToggleHideGoodFiles
                        ]
                        []
                    , text "Only show files with messages"
                    ]
                ]
            , hr [] []
            , case m.fileIndex of
                Just fileIndex ->
                    div [ class "row", style [ ( "padding-top", "10px" ) ] ]
                        [ div [ class "col-md-6 col-sm-6" ]
                            [ div [ class "list-group" ]
                                (fileIndex
                                    |> List.filter allowFile
                                    |> List.map asItem
                                )
                            ]
                        , div [ class "col-md-6 col-sm-6" ]
                            [ if m.selectedFile == Nothing then
                                div [] []
                              else
                                MessageList.view m.messageList |> Html.map MessageListMsg
                            ]
                        ]

                _ ->
                    div [] []
            ]
