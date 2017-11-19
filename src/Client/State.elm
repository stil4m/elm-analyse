module Client.State exposing (State, listen, tick, toMaybe, view)

import Analyser.Checks
import Analyser.State as AS
import Client.LoadingScreen as LoadingScreen
import Client.Socket exposing (dashboardAddress)
import Html exposing (Html)
import Json.Decode as JD
import Navigation exposing (Location)
import RemoteData exposing (RemoteData)
import WebSocket as WS


type alias State =
    RemoteData String AS.State


listen : Location -> Sub State
listen location =
    WS.listen (dashboardAddress location) (JD.decodeString (AS.decodeState Analyser.Checks.schemas) >> RemoteData.fromResult)


tick : Location -> Cmd msg
tick location =
    WS.send (dashboardAddress location) "ping"


toMaybe : State -> Maybe AS.State
toMaybe =
    RemoteData.toMaybe


view : State -> (AS.State -> Html msg) -> Html msg
view s f =
    LoadingScreen.viewStateFromRemoteData s f
