module Client.DashBoard.DashBoard exposing (Model, Msg, subscriptions, init, update, view)

import Analyser.State as State exposing (State)
import Client.DashBoard.ActiveMessageDialog as ActiveMessageDialog
import Html exposing (Html, div, text, span, h3)
import Json.Decode as JD
import RemoteData as RD exposing (RemoteData)
import Time
import WebSocket as WS
import Analyser.Messages.Types exposing (Message, MessageStatus)
import Analyser.Messages.Util as Messages
import Client.Messages as M
import Tuple2
import Navigation exposing (Location)
import Client.Socket exposing (dashboardAddress)


type alias Model =
    { messages : RemoteData String State
    , active : ActiveMessageDialog.Model
    }


type Msg
    = NewMsg (Result String State)
    | Tick
    | Focus Message
    | ActiveMessageDialogMsg ActiveMessageDialog.Msg


subscriptions : Location -> Model -> Sub Msg
subscriptions location model =
    Sub.batch
        [ WS.listen (dashboardAddress location) (JD.decodeString State.decodeState >> NewMsg)
        , Time.every (Time.second * 10) (always Tick)
        , ActiveMessageDialog.subscriptions model.active |> Sub.map ActiveMessageDialogMsg
        ]


init : Location -> ( Model, Cmd Msg )
init location =
    ( { messages = RD.Loading
      , active = ActiveMessageDialog.init
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
                    ( { model | messages = RD.Success o |> RD.map sortMessages }
                    , Cmd.none
                    )

                Err e ->
                    ( { model | messages = RD.Failure e }
                    , Cmd.none
                    )

        Focus m ->
            ActiveMessageDialog.show m model.active
                |> Tuple2.mapFirst (\x -> { model | active = x })
                |> Tuple2.mapSecond (Cmd.map ActiveMessageDialogMsg)

        ActiveMessageDialogMsg subMsg ->
            ActiveMessageDialog.update location subMsg model.active
                |> Tuple2.mapFirst (\x -> { model | active = x })
                |> Tuple2.mapSecond (Cmd.map ActiveMessageDialogMsg)


view : Model -> Html Msg
view m =
    div []
        [ case m.messages of
            RD.Loading ->
                text "Loading..."

            RD.Success state ->
                if State.isBusy state then
                    text "Loading..."
                else
                    viewState state

            RD.Failure e ->
                div []
                    [ text "Something went wrong"
                    , text <| toString e
                    ]

            RD.NotAsked ->
                span [] []
        , ActiveMessageDialog.view m.active |> Html.map ActiveMessageDialogMsg
        ]


viewState : State -> Html Msg
viewState state =
    div []
        [ h3 [] [ text "Messages" ]
        , M.viewAll Focus state.messages
        ]
