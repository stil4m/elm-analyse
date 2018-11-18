module Docs.Main exposing (main)

import Bootstrap.Navbar
import Browser exposing (Document)
import Browser.Navigation as Browser
import Docs.Changelog as Changelog
import Docs.Configuration as Configuration
import Docs.Contributing as Contributing
import Docs.Features as Features
import Docs.Home
import Docs.Menu
import Docs.MsgDoc
import Docs.Page as Page exposing (Page(..))
import Html exposing (Html)
import Url exposing (Url)


main : Program Flags Model Msg
main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        , onUrlChange = OnLocation
        , onUrlRequest = OnUrlRequest
        }


type alias Flags =
    ()


type Msg
    = OnLocation Url
    | OnUrlRequest Browser.UrlRequest
    | MenuMsg Bootstrap.Navbar.State
    | ChangelogMsg Changelog.Msg


type Content
    = HomeContent
    | ChangelogContent Changelog.Model
    | NoContent
    | MessagesContent (Maybe String)
    | ConfigurationContent
    | FeaturesContent
    | ContributingContent


type alias Model =
    { page : Page
    , menu : Bootstrap.Navbar.State
    , key : Browser.Key
    , content : Content
    }


init : Flags -> Url -> Browser.Key -> ( Model, Cmd Msg )
init () location key =
    let
        ( menu, menuCmds ) =
            Bootstrap.Navbar.initialState MenuMsg

        page =
            Page.nextPage location

        ( content, contentCmds ) =
            contentFromPage page
    in
    ( { page = page
      , menu = menu
      , content = content
      , key = key
      }
    , Cmd.batch [ menuCmds, contentCmds ]
    )


contentFromPage : Page -> ( Content, Cmd Msg )
contentFromPage page =
    case page of
        Home ->
            ( HomeContent, Cmd.none )

        Messages x ->
            ( MessagesContent x, Cmd.none )

        Changelog ->
            let
                ( changelogModel, cmds ) =
                    Changelog.init
            in
            ( ChangelogContent changelogModel
            , Cmd.map ChangelogMsg cmds
            )

        Features _ ->
            ( FeaturesContent
            , Cmd.none
            )

        Configuration ->
            ( ConfigurationContent, Cmd.none )

        NotFound ->
            ( NoContent, Cmd.none )

        Contributing ->
            ( ContributingContent, Cmd.none )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        MenuMsg s ->
            ( { model | menu = s }
            , Cmd.none
            )

        OnUrlRequest r ->
            case r of
                Browser.Internal u ->
                    let
                        ( m, cmds ) =
                            init () u model.key
                    in
                    ( m
                    , Cmd.batch
                        [ cmds
                        , Browser.pushUrl model.key (Url.toString u)
                        ]
                    )

                Browser.External d ->
                    ( model, Browser.load d )

        OnLocation location ->
            init () location model.key

        ChangelogMsg x ->
            case model.content of
                ChangelogContent subModel ->
                    ( { model | content = ChangelogContent (Changelog.update x subModel) }
                    , Cmd.none
                    )

                _ ->
                    ( model, Cmd.none )


view : Model -> Document Msg
view model =
    { title = "Elm Analyse"
    , body =
        [ Docs.Menu.menu MenuMsg model.menu
        , body model
        ]
    }


body : Model -> Html Msg
body model =
    case model.content of
        HomeContent ->
            Docs.Home.view

        MessagesContent m ->
            Html.div []
                [ Docs.MsgDoc.view m
                ]

        ChangelogContent x ->
            Changelog.view x |> Html.map ChangelogMsg

        NoContent ->
            Html.div [] [ Html.text "NotFound!" ]

        FeaturesContent ->
            Features.view

        ConfigurationContent ->
            Configuration.view

        ContributingContent ->
            Contributing.view
