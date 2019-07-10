module Client.App.Menu exposing (view)

import Client.Routing as Routing exposing (Route)
import Html exposing (Html, a, div, i, li, nav, text, ul)
import Html.Attributes exposing (attribute, class, href, style)


view : Route -> Html a
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
        ]


isActiveClass : Route -> Routing.Route -> String
isActiveClass l r =
    if l == r then
        "active"

    else
        ""


menuItem : Route -> Routing.Route -> String -> String -> Html a
menuItem location route name icon =
    li [ class (isActiveClass location route) ]
        [ a
            [ href (Routing.toUrl route)

            --, Html.Events.onClick route
            ]
            [ i [ class ("fa fa-" ++ icon ++ " fa-fw") ] [], text " ", text name ]
        ]
