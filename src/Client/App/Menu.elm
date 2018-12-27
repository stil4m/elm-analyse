module Client.App.Menu exposing (view)

import Client.Routing as Routing exposing (Route)
import Html exposing (Html, a, div, i, li, nav, text, ul)
import Html.Attributes exposing (attribute, class, href, style)
import Html.Events exposing (onClick)
import Url exposing (Url)


view : Url -> Html (Result Route msg)
view l =
    nav [ class "navbar navbar-default navbar-static-top", attribute "role" "navigation", style "margin-bottom" "0" ]
        [ div [ class "navbar-header" ]
            [ a
                [ class "navbar-brand", href "/" ]
                [ text "Elm Analyse" ]
            ]
        , div [ class "navbar-default sidebar", attribute "role" "navigation" ]
            [ div [ class "sidebar-nav" ]
                [ ul [ class "nav in" ]
                    [ menuItem l Routing.Dashboard "Dashboard" "dashboard"
                    , menuItem l Routing.Messages "All Messages" "list"
                    , menuItem l Routing.FileTree "Tree" "files-o"
                    , menuItem l Routing.Dependencies "Dependencies" "arrows"
                    , menuItem l Routing.Modules "Modules" "cubes"
                    ]
                ]
            ]
            |> Html.map Err
        ]


isActiveClass : Url -> Routing.Route -> String
isActiveClass l r =
    if Routing.fromLocation l == r then
        "active"

    else
        ""


menuItem : Url -> Routing.Route -> String -> String -> Html Route
menuItem location route name icon =
    li [ class (isActiveClass location route) ]
        [ a [ href (Routing.toUrl route), Html.Events.onClick route ]
            [ i [ class ("fa fa-" ++ icon ++ " fa-fw") ] [], text " ", text name ]
        ]
