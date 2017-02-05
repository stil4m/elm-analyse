module Client.Main exposing (..)

import Client.App.App as App
import Html exposing (program, div)
import CssFrameworks
import CssFrameworks.Bootstrap


main : Program Never App.Model App.Msg
main =
    program
        { init = App.init
        , view = view
        , update = App.update
        , subscriptions = App.subscriptions
        }


view : App.Model -> Html.Html App.Msg
view model =
    div []
        [ App.view model
        , CssFrameworks.toStyleNode CssFrameworks.Bootstrap.bootstrap
        ]
