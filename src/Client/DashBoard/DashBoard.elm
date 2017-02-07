module Client.DashBoard.DashBoard exposing (Model, Msg, subscriptions, init, update, view)

import Client.DashBoard.State as State exposing (State)
import Client.DashBoard.ActiveMessageDialog as ActiveMessageDialog
import Html exposing (Html, div, text, span, h3, ul, li, a, strong)
import Html.Events exposing (onClick)
import Json.Decode as JD
import RemoteData as RD exposing (RemoteData)
import Time
import WebSocket as WS
import Analyser.Messages as Messages exposing (Message)
import Html.Attributes exposing (class, style)
import Tuple2
import Navigation exposing (Location)


type alias Model =
    { messages : RemoteData String State
    , active : ActiveMessageDialog.Model
    }


type Msg
    = NewMsg (Result String State)
    | Tick
    | Focus Message
    | ActiveMessageDialogMsg ActiveMessageDialog.Msg


socketAddress : Location -> String
socketAddress { host } =
    "ws://" ++ host ++ "/dashboard"


subscriptions : Location -> Model -> Sub Msg
subscriptions location _ =
    Sub.batch
        [ WS.listen (socketAddress location) (JD.decodeString State.decodeState >> NewMsg)
        , Time.every (Time.second * 10) (always Tick)
        ]


init : ( Model, Cmd Msg )
init =
    ( { messages = RD.Loading
      , active = ActiveMessageDialog.init
      }
    , Cmd.none
    )


update : Location -> Msg -> Model -> ( Model, Cmd Msg )
update location msg model =
    case msg of
        Tick ->
            ( model
            , WS.send (socketAddress location) "ping"
            )

        NewMsg x ->
            case x of
                Ok o ->
                    ( { model | messages = RD.Success o }
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

        ActiveMessageDialogMsg x ->
            ( { model | active = ActiveMessageDialog.update x model.active }
            , Cmd.none
            )


view : Model -> Html Msg
view m =
    div [ class "container" ]
        [ case m.messages of
            RD.Loading ->
                text "Loading..."

            RD.Success state ->
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
        , ul
            [ style
                [ ( "list-style", "none" )
                , ( "padding", "0" )
                ]
            ]
            (List.indexedMap viewMessage state.messages)
        ]


viewMessage : Int -> Message -> Html Msg
viewMessage n x =
    li
        [ style
            [ ( "margin", "10px" )
            , ( "padding", "10px" )
            , ( "border", "1px solid #ccc" )
            , ( "border-radius", "3px" )
            , ( "backgound", "1px solid #eee" )
            ]
        ]
        [ div [ style [ ( "display", "table-row" ) ] ]
            [ a
                [ onClick (Focus x)
                , style [ ( "cursor", "pointer" ), ( "display", "table-cell" ), ( "padding-right", "20px" ), ( "font-size", "200%" ), ( "vertical-align", "middle" ) ]
                ]
                [ strong []
                    [ text <| (++) "#" <| toString <| n + 1 ]
                ]
            , span [ style [ ( "display", "table-cell" ) ] ]
                [ text <| Messages.asString x ]
            ]
        ]
