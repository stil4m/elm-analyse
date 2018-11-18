module Client.State exposing (State, listen, tick, toMaybe, view)

import Analyser.Checks
import Analyser.State as AS
import Client.LoadingScreen as LoadingScreen
import Client.Socket exposing (dashboardAddress)
import Html exposing (Html)
import Http
import Json.Decode as JD
import RemoteData exposing (RemoteData)
import Url exposing (Url)


type alias State =
    RemoteData Http.Error AS.State


listen : Url -> Sub State
listen location =
    -- WS.listen (dashboardAddress location) (JD.decodeString (AS.decodeState Analyser.Checks.schemas) >> RemoteData.fromResult)
    Sub.none


tick : Url -> Cmd State
tick location =
    Http.get "/state" (AS.decodeState Analyser.Checks.schemas)
        |> Http.send identity
        |> Cmd.map RemoteData.fromResult



-- WS.send (dashboardAddress location) "ping"
-- Cmd.none


toMaybe : State -> Maybe AS.State
toMaybe =
    RemoteData.toMaybe


view : State -> (AS.State -> Html msg) -> Html msg
view s f =
    LoadingScreen.viewStateFromRemoteData s f
