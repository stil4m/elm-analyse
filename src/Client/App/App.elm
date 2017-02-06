module Client.App.App exposing (..)

import Html exposing (..)
import Client.App.Menu
import Client.App.Models exposing (Content(DashBoardContent), Msg(..))
import Client.DashBoard.DashBoard as DashBoard
import Tuple2
import WebSocket as WS


type alias Model =
    Content


endpoint : String
endpoint =
    "ws://localhost:3000/control"


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ case model of
            DashBoardContent sub ->
                DashBoard.subscriptions sub |> Sub.map DashBoardMsg
        , WS.keepAlive endpoint
        ]


init : ( Model, Cmd Msg )
init =
    DashBoard.init
        |> Tuple2.mapFirst DashBoardContent
        |> Tuple2.mapSecond (Cmd.map DashBoardMsg)


view : Model -> Html.Html Msg
view m =
    div []
        [ Client.App.Menu.view
        , case m of
            DashBoardContent subModel ->
                DashBoard.view subModel |> Html.map DashBoardMsg
        ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Refresh ->
            ( model
            , WS.send endpoint "reload"
            )

        DashBoardMsg x ->
            case model of
                DashBoardContent subModel ->
                    DashBoard.update x subModel
                        |> Tuple2.mapFirst DashBoardContent
                        |> Tuple2.mapSecond (Cmd.map DashBoardMsg)
