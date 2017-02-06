module Client.App.Menu exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Client.App.Models exposing (Msg(Refresh))


view : Html Msg
view =
    nav
        [ class "navbar navbar-default" ]
        [ div
            [ class "container-fluid" ]
            [ div
                [ class "navbar-header" ]
                []
            , ul
                [ class "nav navbar-nav navbar-left" ]
                [ li
                    []
                    [ a
                        [ href "#" ]
                        [ text "Home" ]
                    ]
                ]
            , Html.form
                [ class "navbar-form navbar-right" ]
                [ button
                    [ type_ "button", class "btn btn-default" ]
                    [ text "Refresh" ]
                ]
            ]
        ]
