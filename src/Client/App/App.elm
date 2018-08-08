module Client.App.App exposing (Model, Msg(OnLocation), init, subscriptions, update, view)

import Client.App.Menu
import Client.Components.FileTree as FileTree
import Client.Dashboard as Dashboard
import Client.DependenciesPage as DependenciesPage
import Client.Graph.Graph as Graph
import Client.Graph.PackageDependencies as PackageDependencies
import Client.MessagesPage as MessagesPage
import Client.Routing as Routing
import Client.Socket exposing (controlAddress)
import Client.State exposing (State)
import Html exposing (div)
import Html.Attributes exposing (id, style)
import Navigation exposing (Location)
import RemoteData
import Time
import WebSocket as WS


type Msg
    = MessagesPageMsg MessagesPage.Msg
    | FileTreeMsg FileTree.Msg
    | PackageDependenciesMsg PackageDependencies.Msg
    | Refresh
    | OnLocation Location
    | Tick
    | NewState State


type alias Model =
    { location : Location
    , content : Content
    , state : State
    }


type Content
    = MessagesPageContent MessagesPage.Model
    | DashboardContent
    | DependenciesPageContent
    | FileTreeContent FileTree.Model
    | GraphContent Graph.Model
    | PackageDependenciesContent PackageDependencies.Model
    | NotFound


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Client.State.listen model.location |> Sub.map NewState
        , Time.every (Time.second * 10) (always Tick)
        , case model.content of
            MessagesPageContent sub ->
                MessagesPage.subscriptions sub |> Sub.map MessagesPageMsg

            GraphContent _ ->
                Sub.none

            FileTreeContent sub ->
                FileTree.subscriptions sub |> Sub.map FileTreeMsg

            PackageDependenciesContent _ ->
                Sub.none

            DashboardContent ->
                Sub.none

            DependenciesPageContent ->
                Sub.none

            NotFound ->
                Sub.none
        , WS.keepAlive (controlAddress model.location)
        ]


init : Location -> ( Model, Cmd Msg )
init l =
    onLocation l { location = l, content = NotFound, state = RemoteData.Loading }


onLocation : Location -> Model -> ( Model, Cmd Msg )
onLocation l model =
    let
        route =
            Routing.fromLocation l
    in
    case route of
        Routing.FileTree ->
            FileTree.init
                |> Tuple.mapFirst (\x -> { model | content = FileTreeContent x, location = l })
                |> Tuple.mapSecond (Cmd.map FileTreeMsg)

        Routing.Modules ->
            ( { model | content = GraphContent (Graph.init model.state), location = l }, Cmd.none )

        Routing.PackageDependencies ->
            ( { model | content = PackageDependenciesContent (PackageDependencies.init model.state), location = l }
            , Cmd.none
            )

        Routing.Messages ->
            ( { model | content = MessagesPageContent (MessagesPage.init model.state), location = l }, Cmd.none )

        Routing.Dependencies ->
            ( { model | content = DependenciesPageContent, location = l }, Cmd.none )

        Routing.Dashboard ->
            ( { model | content = DashboardContent, location = l }, Cmd.none )

        Routing.NotFound ->
            ( { model | content = NotFound, location = l }, Cmd.none )


view : Model -> Html.Html Msg
view m =
    div []
        [ Client.App.Menu.view Refresh m.location
        , div [ id "page-wrapper", style [ ( "overflow", "auto" ) ] ]
            [ case m.content of
                MessagesPageContent subModel ->
                    MessagesPage.view m.state subModel |> Html.map MessagesPageMsg

                GraphContent subModel ->
                    Graph.view m.state subModel

                FileTreeContent subModel ->
                    FileTree.view subModel |> Html.map FileTreeMsg

                PackageDependenciesContent subModel ->
                    PackageDependencies.view subModel |> Html.map PackageDependenciesMsg

                DashboardContent ->
                    Dashboard.view m.state

                DependenciesPageContent ->
                    DependenciesPage.view m.state

                NotFound ->
                    Html.h3 [] [ Html.text "Not Found" ]
            ]
        ]


onNewState : State -> Model -> Model
onNewState s model =
    { model | state = s, content = updateStateInContent s model.content }


updateStateInContent : State -> Content -> Content
updateStateInContent state content =
    case content of
        MessagesPageContent sub ->
            MessagesPageContent (MessagesPage.onNewState state sub)

        DashboardContent ->
            content

        DependenciesPageContent ->
            content

        FileTreeContent sub ->
            FileTreeContent (FileTree.onNewState state sub)

        GraphContent sub ->
            GraphContent (Graph.onNewState state sub)

        PackageDependenciesContent sub ->
            PackageDependenciesContent (PackageDependencies.onNewState state sub)

        NotFound ->
            content


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        OnLocation l ->
            onLocation l model

        Tick ->
            ( model
            , Client.State.tick model.location
            )

        Refresh ->
            ( model
            , WS.send (controlAddress model.location) "reload"
            )

        MessagesPageMsg subMsg ->
            onMessagesPageMsg subMsg model

        FileTreeMsg subMsg ->
            onFileTreeMsg subMsg model

        PackageDependenciesMsg subMsg ->
            ( onPackageDependenciesMsg subMsg model, Cmd.none )

        NewState state ->
            ( onNewState state model, Cmd.none )


onPackageDependenciesMsg : PackageDependencies.Msg -> Model -> Model
onPackageDependenciesMsg subMsg model =
    case model.content of
        PackageDependenciesContent subModel ->
            { model | content = PackageDependenciesContent (PackageDependencies.update subMsg subModel) }

        _ ->
            model


onFileTreeMsg : FileTree.Msg -> Model -> ( Model, Cmd Msg )
onFileTreeMsg subMsg model =
    case model.content of
        FileTreeContent subModel ->
            FileTree.update model.state model.location subMsg subModel
                |> Tuple.mapFirst (\x -> { model | content = FileTreeContent x })
                |> Tuple.mapSecond (Cmd.map FileTreeMsg)

        _ ->
            ( model, Cmd.none )


onMessagesPageMsg : MessagesPage.Msg -> Model -> ( Model, Cmd Msg )
onMessagesPageMsg subMsg model =
    case model.content of
        MessagesPageContent subModel ->
            MessagesPage.update model.state model.location subMsg subModel
                |> Tuple.mapFirst (\x -> { model | content = MessagesPageContent x })
                |> Tuple.mapSecond (Cmd.map MessagesPageMsg)

        _ ->
            ( model, Cmd.none )
