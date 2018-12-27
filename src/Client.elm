module Client exposing (main)

import Client.App.App as App


main : Program () App.Model App.Msg
main =
    App.main
