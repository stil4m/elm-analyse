module Client.App.App exposing (Model, Msg(..), main)

import Browser
import Browser.Navigation exposing (Key)
import Client.App.Menu
import Client.Components.FileTree as FileTree
import Client.Dashboard as Dashboard
import Client.DependenciesPage as DependenciesPage
import Client.Graph.Graph as Graph
import Client.Graph.PackageDependencies as PackageDependencies
import Client.MessagesPage as MessagesPage
import Client.Routing as Routing exposing (Route)
import Client.State exposing (State)
import Html exposing (div)
import Html.Attributes exposing (id, style)
import RemoteData
import Time
import Url exposing (Url)


main : Program () Model Msg
main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , onUrlRequest = OnUrlRequest
        , onUrlChange = OnUrlChange
        , subscriptions = subscriptions
        }


type Msg
    = MessagesPageMsg MessagesPage.Msg
    | FileTreeMsg FileTree.Msg
    | PackageDependenciesMsg PackageDependencies.Msg
    | OnUrlRequest Browser.UrlRequest
    | OnUrlChange Url
    | Tick
    | NewState State


type alias Model =
    { location : Route
    , content : Content
    , state : State
    , key : Key
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
subscriptions _ =
    Time.every 1000 (always Tick)


init : () -> Url -> Browser.Navigation.Key -> ( Model, Cmd Msg )
init () l key =
    onLocation l { location = Routing.NotFound, key = key, content = NotFound, state = RemoteData.Loading }


onLocation : Url -> Model -> ( Model, Cmd Msg )
onLocation url model =
    onRoute (Routing.fromUrl url) model


onRoute : Route -> Model -> ( Model, Cmd Msg )
onRoute route model =
    case route of
        Routing.FileTree ->
            case model.content of
                FileTreeContent _ ->
                    ( model, Cmd.none )

                _ ->
                    FileTree.init
                        |> Tuple.mapFirst (\x -> { model | content = FileTreeContent x, location = route })
                        |> Tuple.mapSecond (Cmd.map FileTreeMsg)

        Routing.Modules ->
            case model.content of
                GraphContent _ ->
                    ( model, Cmd.none )

                _ ->
                    ( { model | content = GraphContent (Graph.init model.state), location = route }, Cmd.none )

        Routing.PackageDependencies ->
            case model.content of
                PackageDependenciesContent _ ->
                    ( model, Cmd.none )

                _ ->
                    ( { model | content = PackageDependenciesContent (PackageDependencies.init model.state), location = route }
                    , Cmd.none
                    )

        Routing.Messages ->
            case model.content of
                PackageDependenciesContent _ ->
                    ( model, Cmd.none )

                _ ->
                    ( { model | content = MessagesPageContent (MessagesPage.init model.state), location = route }, Cmd.none )

        Routing.Dependencies ->
            case model.content of
                DependenciesPageContent ->
                    ( model, Cmd.none )

                _ ->
                    ( { model | content = DependenciesPageContent, location = route }, Cmd.none )

        Routing.Dashboard ->
            case model.content of
                DashboardContent ->
                    ( model, Cmd.none )

                _ ->
                    ( { model | content = DashboardContent, location = route }, Cmd.none )

        Routing.NotFound ->
            ( { model | content = NotFound, location = route }, Cmd.none )


view : Model -> Browser.Document Msg
view model =
    { title = "Elm Analyse"
    , body =
        [ viewInner model
        ]
    }


viewInner : Model -> Html.Html Msg
viewInner m =
    div []
        [ Client.App.Menu.view m.location
        , div [ id "page-wrapper", style "overflow" "auto" ]
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
        OnUrlChange u ->
            let
                route =
                    Routing.fromUrl u
            in
            onRoute route model

        OnUrlRequest req ->
            case req of
                Browser.Internal u ->
                    ( model
                    , Routing.setRoute model.key (Routing.fromUrl u)
                    )

                Browser.External _ ->
                    ( model, Cmd.none )

        Tick ->
            ( model
            , Client.State.tick model.location
                |> Cmd.map NewState
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
            FileTree.update model.state subMsg subModel
                |> Tuple.mapFirst (\x -> { model | content = FileTreeContent x })
                |> Tuple.mapSecond (Cmd.map FileTreeMsg)

        _ ->
            ( model, Cmd.none )


onMessagesPageMsg : MessagesPage.Msg -> Model -> ( Model, Cmd Msg )
onMessagesPageMsg subMsg model =
    case model.content of
        MessagesPageContent subModel ->
            MessagesPage.update model.state subMsg subModel
                |> Tuple.mapFirst (\x -> { model | content = MessagesPageContent x })
                |> Tuple.mapSecond (Cmd.map MessagesPageMsg)

        _ ->
            ( model, Cmd.none )
