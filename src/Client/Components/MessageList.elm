module Client.Components.MessageList exposing (Model, Msg, init, update, view, withMessages)

import Analyser.Messages.Grouped as Grouped exposing (GroupedMessages)
import Analyser.Messages.Types exposing (Message)
import Client.Components.ActiveMessageDialog as ActiveMessageDialog
import Client.Messages as M
import Html exposing (Html, div, text)
import Html.Attributes exposing (class)


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


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Focus m ->
            ActiveMessageDialog.show m model.active
                |> Tuple.mapFirst (\x -> { model | active = x })
                |> Tuple.mapSecond (Cmd.map ActiveMessageDialogMsg)

        ActiveMessageDialogMsg subMsg ->
            let
                ( newActiveDialog, cmds, info ) =
                    ActiveMessageDialog.update subMsg model.active

                newMessages =
                    case info of
                        Just (ActiveMessageDialog.Fixed m) ->
                            Grouped.markFixed m model.messages

                        Nothing ->
                            model.messages
            in
            ( { model | active = newActiveDialog, messages = newMessages }
            , Cmd.map ActiveMessageDialogMsg cmds
            )


view : Model -> Html Msg
view model =
    div []
        [ if Grouped.isEmpty model.messages then
            div [ class "alert alert-success" ] [ text "No messages" ]

          else
            M.viewAll Focus model.messages
        , ActiveMessageDialog.view model.active |> Html.map ActiveMessageDialogMsg
        ]
