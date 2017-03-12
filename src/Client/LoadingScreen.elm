module Client.LoadingScreen exposing (..)

import Analyser.State as State exposing (State)
import Html exposing (Html, text, div)
import RemoteData as RD exposing (RemoteData)


viewStateFromRemoteData : RemoteData a State -> (State -> Html msg) -> Html msg
viewStateFromRemoteData rd f =
    case rd of
        RD.Loading ->
            text "Loading..."

        RD.Success state ->
            if State.isBusy state then
                text "Loading..."
            else
                f state

        RD.Failure e ->
            div []
                [ text "Something went wrong"
                , text <| toString e
                ]

        RD.NotAsked ->
            div [] []


viewStateFromMaybe : Maybe State -> (State -> Html msg) -> Html msg
viewStateFromMaybe maybeState f =
    case maybeState of
        Nothing ->
            text "Loading..."

        Just state ->
            if State.isBusy state then
                text "Loading..."
            else
                f state
