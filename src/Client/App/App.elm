module Client.App.App exposing (..)

import Html exposing (..)
import Client.App.Menu
import Client.App.Models exposing (Content(DashBoardContent))
import Client.DashBoard.DashBoard as DashBoard
import Tuple2


type alias Model =
    Content


type Msg
    = DashBoardMsg DashBoard.Msg


subscriptions : Model -> Sub Msg
subscriptions model =
    case model of
        DashBoardContent sub ->
            DashBoard.subscriptions sub |> Sub.map DashBoardMsg


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
        DashBoardMsg x ->
            case model of
                DashBoardContent subModel ->
                    DashBoard.update x subModel
                        |> Tuple2.mapFirst DashBoardContent
                        |> Tuple2.mapSecond (Cmd.map DashBoardMsg)
