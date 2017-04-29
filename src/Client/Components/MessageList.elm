module Client.Components.MessageList exposing (..)

import Client.Components.ActiveMessageDialog as ActiveMessageDialog
import Html exposing (Html, div, text)
import Html.Attributes exposing (class)
import Analyser.Messages.Types exposing (Message, MessageStatus)
import Client.Messages as M
import Tuple2
import Navigation exposing (Location)


type alias Model =
    { messages : List Message
    , active : ActiveMessageDialog.Model
    }


type Msg
    = Focus Message
    | ActiveMessageDialogMsg ActiveMessageDialog.Msg


init : List Message -> Model
init m =
    Model m ActiveMessageDialog.init


withMessages : List Message -> Model -> Model
withMessages x m =
    { m | messages = x }


update : Location -> Msg -> Model -> ( Model, Cmd Msg )
update location msg model =
    case msg of
        Focus m ->
            ActiveMessageDialog.show m model.active
                |> Tuple2.mapFirst (\x -> { model | active = x })
                |> Tuple2.mapSecond (Cmd.map ActiveMessageDialogMsg)

        ActiveMessageDialogMsg subMsg ->
            ActiveMessageDialog.update location subMsg model.active
                |> Tuple2.mapFirst (\x -> { model | active = x })
                |> Tuple2.mapSecond (Cmd.map ActiveMessageDialogMsg)


view : Model -> Html Msg
view model =
    div []
        [ if List.isEmpty model.messages then
            div [ class "alert alert-success" ] [ text "No messages" ]
          else
            M.viewAll Focus model.messages
        , ActiveMessageDialog.view model.active |> Html.map ActiveMessageDialogMsg
        ]


subscriptions : Model -> Sub Msg
subscriptions model =
    ActiveMessageDialog.subscriptions model.active |> Sub.map ActiveMessageDialogMsg
