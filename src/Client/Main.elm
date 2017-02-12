module Client.Main exposing (..)

import Client.App.Models as App
import Client.App.App as App
import Html exposing (div, node)
import Html.Attributes exposing (href, rel)
import CssFrameworks
import CssFrameworks.BootstrapThemes.Sandstone
import CssFrameworks.Bootstrap
import Navigation


main : Program Never App.Model App.Msg
main =
    Navigation.program
        App.OnLocation
        { init = App.init
        , view = view
        , update = App.update
        , subscriptions = App.subscriptions
        }


view : App.Model -> Html.Html App.Msg
view model =
    div []
        [ App.view model
          -- , node "link"
          --     [ href "https://cdnjs.cloudflare.com/ajax/libs/startbootstrap-sb-admin-2/3.3.7+1/css/sb-admin-2.min.css"
          --     , rel "stylesheet"
          --     ]
          --     []
          -- , CssFrameworks.toStyleNode CssFrameworks.BootstrapThemes.Sandstone.sandstoneTheme
        , CssFrameworks.toStyleNode CssFrameworks.Bootstrap.bootstrap
        ]
