module Client.App.Menu exposing (view)

import Html exposing (Html, nav, div, ul, i, li, a, button, form, text)
import Html.Attributes exposing (class, href, type_, style, attribute)
import Client.App.Models exposing (Msg(Refresh))


view : Html Msg
view =
    nav [ class "navbar navbar-default navbar-static-top", attribute "role" "navigation", style [ ( "margin-bottom", "0" ) ] ]
        [ div [ class "navbar-header" ]
            [ a
                [ class "navbar-brand", href "index.html" ]
                [ text "SB Admin v2.0" ]
            ]
        , div [ class "navbar-default sidebar", attribute "role" "navigation" ]
            [ div [ class "sidebar-nav" ]
                [ ul [ class "nav in" ]
                    [ li []
                        [ a [ href "" ]
                            [ i [ class "fa fa-dashboard fa-fw" ] [], text " Dashboard" ]
                        ]
                    ]
                ]
            ]
        ]
