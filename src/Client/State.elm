module Client.State exposing (State, fix, refresh, tick, toMaybe, view)

import Analyser.Checks
import Analyser.Messages.Types exposing (Message)
import Analyser.State as AS
import Client.LoadingScreen as LoadingScreen
import Client.Routing exposing (Route)
import Html exposing (Html)
import Http
import Json.Decode as JD
import Json.Encode as JE
import RemoteData exposing (RemoteData)


type alias State =
    RemoteData Http.Error AS.State


fix : Message -> Cmd (Result Http.Error ())
fix mess =
    Http.post "/api/fix" (Http.jsonBody (JE.object [ ( "id", JE.int mess.id ) ])) (JD.succeed ())
        |> Http.send identity


refresh : Cmd (Result Http.Error String)
refresh =
    Http.post "/api/refresh" Http.emptyBody (JD.succeed "")
        |> Http.send identity


tick : Route -> Cmd State
tick _ =
    Http.get "/state" (AS.decodeState Analyser.Checks.schemas)
        |> Http.send identity
        |> Cmd.map RemoteData.fromResult


toMaybe : State -> Maybe AS.State
toMaybe =
    RemoteData.toMaybe


view : State -> (AS.State -> Html msg) -> Html msg
view s f =
    LoadingScreen.viewStateFromRemoteData s f
