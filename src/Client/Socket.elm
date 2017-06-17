module Client.Socket exposing (controlAddress, dashboardAddress)

import Navigation exposing (Location)


controlAddress : Location -> String
controlAddress { host } =
    "ws://" ++ host ++ "/control"


dashboardAddress : Location -> String
dashboardAddress { host } =
    "ws://" ++ host ++ "/state"
