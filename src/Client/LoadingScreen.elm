module Client.LoadingScreen exposing (viewRemoteData, viewStateFromRemoteData)

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

        RD.Failure _ ->
            div []
                [ text "Something went wrong..."
                ]

        RD.NotAsked ->
            div [] []


viewStateFromRemoteData : RemoteData a State -> (State -> Html msg) -> Html msg
viewStateFromRemoteData rd f =
    viewRemoteData rd (viewState f)


viewState : (State -> Html msg) -> State -> Html msg
viewState f state =
    if State.isBusy state then
        text "Loading..."

    else
        f state
