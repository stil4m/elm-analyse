module Client.App.Menu exposing (view)

import Html exposing (Html, nav, div, ul, i, li, a, button, form, text)
import Html.Attributes exposing (class, href, type_, style, attribute)
import Client.App.Models exposing (Msg(Refresh))
import Html.Events exposing (onClick)


view : Html Msg
view =
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
                    [ li [ class "active" ]
                        [ a [ href "" ]
                            [ i [ class "fa fa-dashboard fa-fw" ] [], text " Dashboard" ]
                        ]
                    ]
                ]
            ]
        ]
