module Client exposing (main)

import Browser
import Browser.Navigation
import Client.App.App as App
import Html exposing (div)


main : Program () App.Model App.Msg
main =
    App.main
