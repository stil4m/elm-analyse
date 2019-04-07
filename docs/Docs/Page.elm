module Docs.Page exposing (Page(..), hash, nextPage)

import Url exposing (Url)
import Url.Parser as Url exposing ((</>), Parser)


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
        , Url.map (Messages << Just) (Url.s "messages" </> Url.string)
        , Url.map (Messages Nothing) (Url.s "messages")
        , Url.map (Features << Just) (Url.s "features" </> Url.string)
        , Url.map (Features Nothing) (Url.s "features")
        , Url.map Changelog (Url.s "changelog")
        , Url.map Contributing (Url.s "contributing")
        , Url.map Configuration (Url.s "configuration")
        ]


nextPage : Url -> Page
nextPage u =
    let
        p =
            Url.parse route { u | path = Maybe.withDefault "" u.fragment }
    in
    Maybe.withDefault Home p


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
