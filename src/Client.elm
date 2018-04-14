module Client exposing (main)

import Client.App.App as App
import Html exposing (div)
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
        ]
