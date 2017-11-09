module Docs.Page exposing (Page(Changelog, Configuration, Contributing, Features, Home, Messages, NotFound), hash, nextPage)

import Navigation exposing (Location)
import String.Extra
import UrlParser as Url exposing ((</>), Parser)


type Page
    = Home
    | Messages (Maybe String)
    | Changelog
    | Features (Maybe String)
    | Configuration
    | NotFound
    | Contributing


route : Parser (Page -> a) a
route =
    Url.oneOf
        [ Url.map Home Url.top
        , Url.map (String.Extra.nonEmpty >> Messages) (Url.s "messages" </> Url.string)
        , Url.map (Messages Nothing) (Url.s "messages")
        , Url.map Changelog (Url.s "changelog")
        , Url.map (Features << Just) (Url.s "features" </> Url.string)
        , Url.map (Features Nothing) (Url.s "features")
        , Url.map Contributing (Url.s "contributing")
        , Url.map Configuration (Url.s "configuration")
        ]


nextPage : Location -> Page
nextPage =
    Url.parseHash route >> Maybe.withDefault NotFound


hash : Page -> String
hash p =
    case p of
        Home ->
            "#"

        Messages Nothing ->
            "#/messages"

        Messages (Just s) ->
            "#/messages/" ++ s

        NotFound ->
            "#"

        Changelog ->
            "#/changelog"

        Features sub ->
            case sub of
                Just s ->
                    "#/features/" ++ s

                Nothing ->
                    "#/features"

        Configuration ->
            "#/configuration"

        Contributing ->
            "#/contributing"
