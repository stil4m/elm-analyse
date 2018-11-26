module Docs.Page exposing (Page(..), hash, nextPage)

import Url exposing (Url)
import Url.Parser as Url exposing (Parser, fragment)


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
        [ Url.map
            (\v ->
                case v of
                    [] ->
                        Home

                    "messages" :: xs ->
                        Messages (List.head xs)

                    [ "changelog" ] ->
                        Changelog

                    "features" :: xs ->
                        Features (List.head xs)

                    [ "contributing" ] ->
                        Contributing

                    [ "configuration" ] ->
                        Configuration

                    _ ->
                        NotFound
            )
            (fragment x)
        , Url.map Home Url.top
        ]


x : Maybe String -> List String
x =
    Maybe.map (String.dropLeft 1 >> String.split "/") >> Maybe.withDefault []


nextPage : Url -> Page
nextPage =
    Url.parse route >> Maybe.withDefault NotFound


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
