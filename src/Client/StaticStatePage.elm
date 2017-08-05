module Client.StaticStatePage exposing (..)

import Analyser.State as State exposing (State)
import Client.LoadingScreen as LoadingScreen
import Html exposing (Html)
import Http
import RemoteData as RD exposing (RemoteData)


type alias StaticPage subModel subMsg =
    { view : subModel -> Html subMsg
    , update : subMsg -> subModel -> ( subModel, Cmd subMsg )
    , init : State -> ( subModel, Cmd subMsg )
    }


type alias Model subModel subMsg =
    { staticPage : StaticPage subModel subMsg
    , subModel : Maybe subModel
    , state : RemoteData Http.Error State
    }


type Msg subMsg
    = OnState (RemoteData Http.Error State)
    | ProxyMsg subMsg


init : StaticPage subModel subMsg -> ( Model subModel subMsg, Cmd (Msg subMsg) )
init x =
    ( Model x Nothing RD.Loading
    , Cmd.map OnState (RD.sendRequest (Http.get "/state" State.decodeState))
    )


update : Msg subMsg -> Model subModel subMsg -> ( Model subModel subMsg, Cmd (Msg subMsg) )
update msg model =
    case msg of
        OnState newState ->
            let
                ( newSubModel, subModelMsgs ) =
                    case RD.toMaybe newState of
                        Just state ->
                            model.staticPage.init state
                                |> Tuple.mapFirst Just

                        Nothing ->
                            ( Nothing, Cmd.none )
            in
            ( { model
                | state = newState
                , subModel = newSubModel
              }
            , Cmd.map ProxyMsg subModelMsgs
            )

        ProxyMsg subMsg ->
            case model.subModel of
                Nothing ->
                    ( model, Cmd.none )

                Just subModel ->
                    let
                        ( newSubModel, subModelMsgs ) =
                            model.staticPage.update subMsg subModel
                    in
                    ( { model | subModel = Just newSubModel }
                    , Cmd.map ProxyMsg subModelMsgs
                    )


view : Model subModel subMsg -> Html (Msg subMsg)
view model =
    LoadingScreen.viewStateFromRemoteData model.state <|
        \_ ->
            case model.subModel of
                Just subModel ->
                    Html.map ProxyMsg (model.staticPage.view subModel)

                Nothing ->
                    Html.div
                        []
                        [ Html.text "NOTHING" ]
