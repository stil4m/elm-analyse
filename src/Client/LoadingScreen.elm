module Client.LoadingScreen exposing (..)

import Analyser.State as State exposing (State)
import Html exposing (Html, div, text)
import RemoteData as RD exposing (RemoteData)


viewRemoteData : RemoteData a b -> (b -> Html msg) -> Html msg
viewRemoteData rd f =
    case rd of
        RD.Loading ->
            text "Loading..."

        RD.Success state ->
            f state

        RD.Failure e ->
            div []
                [ text "Something went wrong"
                , text <| toString e
                ]

        RD.NotAsked ->
            div [] []


viewMaybe : Maybe b -> (b -> Html msg) -> Html msg
viewMaybe m f =
    case m of
        Nothing ->
            text "Loading..."

        Just x ->
            f x


viewStateFromRemoteData : RemoteData a State -> (State -> Html msg) -> Html msg
viewStateFromRemoteData rd f =
    viewRemoteData rd (viewState f)


viewState : (State -> Html msg) -> State -> Html msg
viewState f state =
    if State.isBusy state then
        text "Loading..."
    else
        f state


viewStateFromMaybe : Maybe State -> (State -> Html msg) -> Html msg
viewStateFromMaybe maybeState f =
    viewMaybe maybeState (viewState f)
