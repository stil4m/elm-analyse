module Client.App.Menu exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)


view : Html a
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
            , ul
                [ class "nav navbar-nav navbar-right" ]
                [ li
                    []
                    [ button [ class "btn btn-primary" ] [ text "Reload" ]
                    ]
                ]
            ]
        ]
