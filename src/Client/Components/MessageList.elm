module Client.Components.MessageList exposing (..)

import Analyser.Messages.Types exposing (GroupedMessages, Message)
import Client.Components.ActiveMessageDialog as ActiveMessageDialog
import Client.Messages as M
import Dict
import Html exposing (Html, div, text)
import Html.Attributes exposing (class)
import Navigation exposing (Location)


type alias Model =
    { messages : GroupedMessages
    , active : ActiveMessageDialog.Model
    }


type Msg
    = Focus Message
    | ActiveMessageDialogMsg ActiveMessageDialog.Msg


init : GroupedMessages -> Model
init m =
    Model m ActiveMessageDialog.init


withMessages : GroupedMessages -> Model -> Model
withMessages x m =
    { m | messages = x }


update : Location -> Msg -> Model -> ( Model, Cmd Msg )
update location msg model =
    case msg of
        Focus m ->
            ActiveMessageDialog.show m model.active
                |> Tuple.mapFirst (\x -> { model | active = x })
                |> Tuple.mapSecond (Cmd.map ActiveMessageDialogMsg)

        ActiveMessageDialogMsg subMsg ->
            ActiveMessageDialog.update location subMsg model.active
                |> Tuple.mapFirst (\x -> { model | active = x })
                |> Tuple.mapSecond (Cmd.map ActiveMessageDialogMsg)


view : Model -> Html Msg
view model =
    div []
        [ if Dict.isEmpty model.messages then
            div [ class "alert alert-success" ] [ text "No messages" ]
          else
            M.viewAll Focus model.messages
        , ActiveMessageDialog.view model.active |> Html.map ActiveMessageDialogMsg
        ]


subscriptions : Model -> Sub Msg
subscriptions model =
    ActiveMessageDialog.subscriptions model.active |> Sub.map ActiveMessageDialogMsg
