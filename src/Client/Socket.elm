module Client.Socket exposing (..)

import Navigation exposing (Location)


controlEndpoint : Location -> String
controlEndpoint { host } =
    "ws://" ++ host ++ "/control"
