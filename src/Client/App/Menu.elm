module Client.App.Menu exposing (view)

import Html exposing (Html, nav, div, ul, i, li, a, button, form, text)
import Html.Attributes exposing (class, href, type_, style, attribute)
import Client.App.Models exposing (Msg(Refresh))
import Html.Events exposing (onClick)
import Navigation exposing (Location)


view : Location -> Html Msg
view l =
    nav [ class "navbar navbar-default navbar-static-top", attribute "role" "navigation", style [ ( "margin-bottom", "0" ) ] ]
        [ div [ class "navbar-header" ]
            [ a
                [ class "navbar-brand", href "/" ]
                [ text "Elm Analyse" ]
            , form
                [ class "navbar-form navbar-right" ]
                [ button
                    [ type_ "button", class "btn btn-default", onClick Refresh ]
                    [ text "Refresh" ]
                ]
            ]
        , div [ class "navbar-default sidebar", attribute "role" "navigation" ]
            [ div [ class "sidebar-nav" ]
                [ ul [ class "nav in" ]
                    [ menuItem l "#dashboard" "Dashboard" "dashboard"
                    , menuItem l "#tree" "Tree" "files-o"
                    , menuItem l "#dependency-graph" "Dependency graph" "cubes"
                    ]
                ]
            ]
        ]


isActiveClass : Location -> String -> String
isActiveClass l s =
    if s == l.hash || (l.hash == "" && s == "#dashboard") then
        "active"
    else
        ""


menuItem : Location -> String -> String -> String -> Html msg
menuItem location path name icon =
    li [ class (isActiveClass location path) ]
        [ a [ href path ]
            [ i [ class ("fa fa-" ++ icon ++ " fa-fw") ] [], text " ", text name ]
        ]
