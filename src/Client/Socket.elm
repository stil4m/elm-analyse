module Client.Socket exposing (controlAddress, dashboardAddress)

import Url exposing (Url)


controlAddress : Url -> String
controlAddress { host } =
    "ws://" ++ host ++ "/control"


dashboardAddress : Url -> String
dashboardAddress { host } =
    "ws://" ++ host ++ "/state"
