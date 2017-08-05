module Docs.Menu exposing (..)

import Bootstrap.Navbar as Navbar
import Docs.Page as Page exposing (Page(Changelog, Configuration, Features, Home, Messages))
import Html exposing (text)
import Html.Attributes exposing (href)


menu : (Navbar.State -> msg) -> Navbar.State -> Html.Html msg
menu m state =
    Navbar.config m
        |> Navbar.inverse
        |> Navbar.withAnimation
        |> Navbar.brand [ href (Page.hash Home) ] [ text "Elm Analyse" ]
        |> Navbar.items
            [ Navbar.itemLink
                [ href (Page.hash Features) ]
                [ text "Features" ]
            , Navbar.itemLink
                [ href (Page.hash (Messages Nothing)) ]
                [ text "Checks" ]
            , Navbar.itemLink
                [ href (Page.hash Configuration) ]
                [ text "Configuration" ]
            , Navbar.itemLink
                [ href (Page.hash Changelog) ]
                [ text "Changelog" ]
            ]
        |> Navbar.view state
