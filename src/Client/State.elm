module Client.State exposing (State, refresh, tick, toMaybe, view)

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


refresh : Cmd (Result Http.Error String)
refresh =
    Http.getString "/refresh"
        |> Http.send identity


tick : Url -> Cmd State
tick location =
    Http.get "/state" (AS.decodeState Analyser.Checks.schemas)
        |> Http.send identity
        |> Cmd.map RemoteData.fromResult


toMaybe : State -> Maybe AS.State
toMaybe =
    RemoteData.toMaybe


view : State -> (AS.State -> Html msg) -> Html msg
view s f =
    LoadingScreen.viewStateFromRemoteData s f
