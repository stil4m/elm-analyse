module Client.App.Menu exposing (view)

import Client.App.Models exposing (Msg(Refresh))
import Html exposing (Html, a, button, div, form, i, li, nav, text, ul)
import Html.Attributes exposing (attribute, class, href, style, type_)
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
                    , menuItem l "#module-graph" "Module graph" "cubes"
                    , menuItem l "#package-dependencies" "Package Dependencies" "crosshairs"
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
