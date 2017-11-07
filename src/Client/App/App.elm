module Client.App.App exposing (init, subscriptions, update, view)

import Client.App.Menu
import Client.App.Models exposing (Content(DashboardContent, FileTreeContent, GraphContent, MessagesPageContent, PackageDependenciesContent), Model, ModuleGraphPageMsg, Msg(..), PackageDependenciesPageMsg, moduleGraphPage, packageDependenciesPage)
import Client.Components.FileTree as FileTree
import Client.Dashboard as Dashboard
import Client.MessagesPage as MessagesPage
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
            MessagesPageContent sub ->
                MessagesPage.subscriptions model.location sub |> Sub.map MessagesPageMsg

            GraphContent _ ->
                Sub.none

            FileTreeContent sub ->
                FileTree.subscriptions model.location sub |> Sub.map FileTreeMsg

            PackageDependenciesContent _ ->
                Sub.none

            DashboardContent sub ->
                Dashboard.subscriptions model.location sub |> Sub.map DashboardMsg
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

        "#messages" ->
            MessagesPage.init l
                |> Tuple.mapFirst (\x -> { content = MessagesPageContent x, location = l })
                |> Tuple.mapSecond (Cmd.map MessagesPageMsg)

        _ ->
            Dashboard.init l
                |> Tuple.mapFirst (\x -> { content = DashboardContent x, location = l })
                |> Tuple.mapSecond (Cmd.map DashboardMsg)


view : Model -> Html.Html Msg
view m =
    div []
        [ Client.App.Menu.view m.location
        , div [ id "page-wrapper" ]
            [ case m.content of
                MessagesPageContent subModel ->
                    MessagesPage.view subModel |> Html.map MessagesPageMsg

                GraphContent subModel ->
                    StaticStatePage.view subModel |> Html.map GraphMsg

                FileTreeContent subModel ->
                    FileTree.view subModel |> Html.map FileTreeMsg

                PackageDependenciesContent subModel ->
                    StaticStatePage.view subModel |> Html.map PackageDependenciesMsg

                DashboardContent subModel ->
                    Dashboard.view subModel |> Html.map DashboardMsg
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

        MessagesPageMsg subMsg ->
            onMessagesPageMsg subMsg model

        GraphMsg subMsg ->
            onGraphMsg subMsg model

        FileTreeMsg subMsg ->
            onFileTreeMsg subMsg model

        PackageDependenciesMsg subMsg ->
            onPackageDependenciesMsg subMsg model

        DashboardMsg subMsg ->
            onDashboardMsg subMsg model


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


onDashboardMsg : Dashboard.Msg -> Model -> ( Model, Cmd Msg )
onDashboardMsg subMsg model =
    case model.content of
        DashboardContent subModel ->
            Dashboard.update model.location subMsg subModel
                |> Tuple.mapFirst (\x -> { model | content = DashboardContent x })
                |> Tuple.mapSecond (Cmd.map DashboardMsg)

        _ ->
            model ! []


onMessagesPageMsg : MessagesPage.Msg -> Model -> ( Model, Cmd Msg )
onMessagesPageMsg subMsg model =
    case model.content of
        MessagesPageContent subModel ->
            MessagesPage.update model.location subMsg subModel
                |> Tuple.mapFirst (\x -> { model | content = MessagesPageContent x })
                |> Tuple.mapSecond (Cmd.map MessagesPageMsg)

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
