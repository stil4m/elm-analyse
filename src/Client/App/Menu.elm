module Client.App.Menu exposing (view)

import Client.Routing as Routing
import Html exposing (Html, a, button, div, form, i, li, nav, text, ul)
import Html.Attributes exposing (attribute, class, href, style, type_)
import Html.Events exposing (onClick)
import Navigation exposing (Location)


view : msg -> Location -> Html msg
view refresh l =
    nav [ class "navbar navbar-default navbar-static-top", attribute "role" "navigation", style "margin-bottom" "0" ]
        [ div [ class "navbar-header" ]
            [ a
                [ class "navbar-brand", href "/" ]
                [ text "Elm Analyse" ]
            , form
                [ class "navbar-form navbar-right" ]
                [ button
                    [ type_ "button", class "btn btn-default", onClick refresh ]
                    [ text "Re-analyse" ]
                ]
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


isActiveClass : Location -> Routing.Route -> String
isActiveClass l r =
    if Routing.fromLocation l == r then
        "active"

    else
        ""


menuItem : Location -> Routing.Route -> String -> String -> Html msg
menuItem location route name icon =
    li [ class (isActiveClass location route) ]
        [ a [ href (Routing.toUrl route) ]
            [ i [ class ("fa fa-" ++ icon ++ " fa-fw") ] [], text " ", text name ]
        ]
