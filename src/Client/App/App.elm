module Client.App.App exposing (init, subscriptions, update, view)

import Client.App.Menu
import Client.App.Models exposing (Content(DashBoardContent, FileTreeContent, GraphContent, PackageDependenciesContent), Model, ModuleGraphPageMsg, Msg(..), PackageDependenciesPageMsg, moduleGraphPage, packageDependenciesPage)
import Client.Components.FileTree as FileTree
import Client.DashBoard.DashBoard as DashBoard
import Client.Socket exposing (controlAddress)
import Client.StaticStatePage as StaticStatePage
import Html exposing (div)
import Html.Attributes exposing (id)
import Navigation exposing (Location)
import WebSocket as WS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ case model.content of
            DashBoardContent sub ->
                DashBoard.subscriptions model.location sub |> Sub.map DashBoardMsg

            GraphContent _ ->
                Sub.none

            FileTreeContent sub ->
                FileTree.subscriptions model.location sub |> Sub.map FileTreeMsg

            PackageDependenciesContent _ ->
                Sub.none
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
                |> Tuple.mapFirst (\x -> { content = FileTreeContent x, location = l })
                |> Tuple.mapSecond (Cmd.map FileTreeMsg)

        "#modules" ->
            moduleGraphPage
                |> Tuple.mapFirst (\x -> { content = GraphContent x, location = l })
                |> Tuple.mapSecond (Cmd.map GraphMsg)

        "#package-dependencies" ->
            packageDependenciesPage
                |> Tuple.mapFirst (\x -> { content = PackageDependenciesContent x, location = l })
                |> Tuple.mapSecond (Cmd.map PackageDependenciesMsg)

        _ ->
            DashBoard.init l
                |> Tuple.mapFirst (\x -> { content = DashBoardContent x, location = l })
                |> Tuple.mapSecond (Cmd.map DashBoardMsg)


view : Model -> Html.Html Msg
view m =
    div []
        [ Client.App.Menu.view m.location
        , div [ id "page-wrapper" ]
            [ case m.content of
                DashBoardContent subModel ->
                    DashBoard.view subModel |> Html.map DashBoardMsg

                GraphContent subModel ->
                    StaticStatePage.view subModel |> Html.map GraphMsg

                FileTreeContent subModel ->
                    FileTree.view subModel |> Html.map FileTreeMsg

                PackageDependenciesContent subModel ->
                    StaticStatePage.view subModel |> Html.map PackageDependenciesMsg
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

        GraphMsg subMsg ->
            onGraphMsg subMsg model

        FileTreeMsg subMsg ->
            onFileTreeMsg subMsg model

        PackageDependenciesMsg subMsg ->
            onPackageDependenciesMsg subMsg model


onPackageDependenciesMsg : PackageDependenciesPageMsg -> Model -> ( Model, Cmd Msg )
onPackageDependenciesMsg subMsg model =
    case model.content of
        PackageDependenciesContent subModel ->
            StaticStatePage.update subMsg subModel
                |> Tuple.mapFirst (\x -> { model | content = PackageDependenciesContent x })
                |> Tuple.mapSecond (Cmd.map PackageDependenciesMsg)

        _ ->
            model ! []


onFileTreeMsg : FileTree.Msg -> Model -> ( Model, Cmd Msg )
onFileTreeMsg subMsg model =
    case model.content of
        FileTreeContent subModel ->
            FileTree.update model.location subMsg subModel
                |> Tuple.mapFirst (\x -> { model | content = FileTreeContent x })
                |> Tuple.mapSecond (Cmd.map FileTreeMsg)

        _ ->
            model ! []


onDashBoardMsg : DashBoard.Msg -> Model -> ( Model, Cmd Msg )
onDashBoardMsg subMsg model =
    case model.content of
        DashBoardContent subModel ->
            DashBoard.update model.location subMsg subModel
                |> Tuple.mapFirst (\x -> { model | content = DashBoardContent x })
                |> Tuple.mapSecond (Cmd.map DashBoardMsg)

        _ ->
            model ! []


onGraphMsg : ModuleGraphPageMsg -> Model -> ( Model, Cmd Msg )
onGraphMsg subMsg model =
    case model.content of
        GraphContent subModel ->
            StaticStatePage.update subMsg subModel
                |> Tuple.mapFirst (\x -> { model | content = GraphContent x })
                |> Tuple.mapSecond (Cmd.map GraphMsg)

        _ ->
            model ! []
