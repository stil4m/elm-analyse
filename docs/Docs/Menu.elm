module Docs.Menu exposing (menu)

import Bootstrap.Navbar as Navbar
import Docs.Page as Page exposing (Page(..))
import Html exposing (text)
import Html.Attributes exposing (href)


menu : (Navbar.State -> msg) -> Navbar.State -> Html.Html msg
menu m state =
    Navbar.config m
        |> Navbar.dark
        |> Navbar.withAnimation
        |> Navbar.brand [ href (Page.hash Home) ] [ text "Elm Analyse" ]
        |> Navbar.items
            [ Navbar.itemLink
                [ href (Page.hash (Features Nothing)) ]
                [ text "Features" ]
            , Navbar.itemLink
                [ href (Page.hash (Messages Nothing)) ]
                [ text "Checks" ]
            , Navbar.itemLink
                [ href (Page.hash Configuration) ]
                [ text "Configuration" ]
            , Navbar.itemLink
                [ href (Page.hash Contributing) ]
                [ text "Contributing" ]
            , Navbar.itemLink
                [ href (Page.hash Changelog) ]
                [ text "Changelog" ]
            ]
        |> Navbar.view state
