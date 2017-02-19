module Client.App.App exposing (init, view, update, subscriptions)

import Html exposing (Html, div)
import Html.Attributes exposing (id)
import Client.App.Menu
import Client.App.Models exposing (Model, Content(DashBoardContent, FileTreeContent), Msg(..))
import Client.DashBoard.DashBoard as DashBoard
import Client.FileTree as FileTree
import Tuple2
import WebSocket as WS
import Navigation exposing (Location)
import Client.Socket exposing (controlAddress)


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ case model.content of
            DashBoardContent sub ->
                DashBoard.subscriptions model.location sub |> Sub.map DashBoardMsg

            FileTreeContent sub ->
                FileTree.subscriptions model.location sub |> Sub.map FileTreeMsg
        , WS.keepAlive (controlAddress model.location)
        ]


init : Location -> ( Model, Cmd Msg )
init =
    onLocation


onLocation : Location -> ( Model, Cmd Msg )
onLocation l =
    case l.hash of
        "#tree" ->
            FileTree.init l
                |> Tuple2.mapFirst (\x -> { content = FileTreeContent x, location = l })
                |> Tuple2.mapSecond (Cmd.map FileTreeMsg)

        _ ->
            DashBoard.init l
                |> Tuple2.mapFirst (\x -> { content = DashBoardContent x, location = l })
                |> Tuple2.mapSecond (Cmd.map DashBoardMsg)


view : Model -> Html.Html Msg
view m =
    div []
        [ Client.App.Menu.view m.location
        , div [ id "page-wrapper" ]
            [ case m.content of
                DashBoardContent subModel ->
                    DashBoard.view subModel |> Html.map DashBoardMsg

                FileTreeContent subModel ->
                    FileTree.view subModel |> Html.map FileTreeMsg
            ]
        ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        OnLocation l ->
            onLocation l

        Refresh ->
            ( model
            , WS.send (controlAddress model.location) "reload"
            )

        DashBoardMsg subMsg ->
            onDashBoardMsg subMsg model

        FileTreeMsg subMsg ->
            onFileTreeMsg subMsg model


onFileTreeMsg : FileTree.Msg -> Model -> ( Model, Cmd Msg )
onFileTreeMsg subMsg model =
    case model.content of
        FileTreeContent subModel ->
            FileTree.update model.location subMsg subModel
                |> Tuple2.mapFirst (\x -> { model | content = FileTreeContent x })
                |> Tuple2.mapSecond (Cmd.map FileTreeMsg)

        _ ->
            model ! []


onDashBoardMsg : DashBoard.Msg -> Model -> ( Model, Cmd Msg )
onDashBoardMsg subMsg model =
    case model.content of
        DashBoardContent subModel ->
            DashBoard.update model.location subMsg subModel
                |> Tuple2.mapFirst (\x -> { model | content = DashBoardContent x })
                |> Tuple2.mapSecond (Cmd.map DashBoardMsg)

        _ ->
            model ! []
