module Client.App.App exposing (..)

import Html exposing (..)
import Client.App.Menu
import Client.App.Models exposing (Model, Content(DashBoardContent), Msg(..))
import Client.DashBoard.DashBoard as DashBoard
import Tuple2
import WebSocket as WS
import Navigation exposing (Location)


endpoint : Location -> String
endpoint { host } =
    "ws://" ++ host ++ "/control"


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ case model.content of
            DashBoardContent sub ->
                DashBoard.subscriptions model.location sub |> Sub.map DashBoardMsg
        , WS.keepAlive (endpoint model.location)
        ]


init : Location -> ( Model, Cmd Msg )
init l =
    DashBoard.init
        |> Tuple2.mapFirst (\x -> { content = DashBoardContent x, location = Debug.log "Loc" l })
        |> Tuple2.mapSecond (Cmd.map DashBoardMsg)


view : Model -> Html.Html Msg
view m =
    div []
        [ Client.App.Menu.view
        , case m.content of
            DashBoardContent subModel ->
                DashBoard.view subModel |> Html.map DashBoardMsg
        ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        OnLocation _ ->
            model ! []

        Refresh ->
            ( model
            , WS.send (endpoint model.location) "reload"
            )

        DashBoardMsg x ->
            case model.content of
                DashBoardContent subModel ->
                    DashBoard.update model.location x subModel
                        |> Tuple2.mapFirst (\x -> { model | content = DashBoardContent x })
                        |> Tuple2.mapSecond (Cmd.map DashBoardMsg)
