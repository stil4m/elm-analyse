module Client.App.Menu exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Client.App.Models exposing (Msg(Refresh))
import Html.Events exposing (onClick)


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
                    [ type_ "button", class "btn btn-default", onClick Refresh ]
                    [ text "Refresh" ]
                ]
            ]
        ]
