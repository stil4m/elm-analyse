module Client.Dashboard exposing (..)

import Analyser.State as State exposing (State)
import Client.LoadingScreen as LoadingScreen
import Client.Socket exposing (dashboardAddress)
import Client.View.Widget as Widget
import Html exposing (Html, div, h3, text)
import Html.Attributes
import Json.Decode as JD
import Navigation exposing (Location)
import RemoteData as RD exposing (RemoteData)
import Time
import WebSocket as WS


type alias Model =
    RemoteData String State


type Msg
    = NewMsg (Result String State)
    | Tick


subscriptions : Location -> Model -> Sub Msg
subscriptions location _ =
    Sub.batch
        [ WS.listen (dashboardAddress location) (JD.decodeString State.decodeState >> NewMsg)
        , Time.every (Time.second * 10) (always Tick)
        ]


init : Location -> ( Model, Cmd Msg )
init location =
    ( RD.Loading
    , WS.send (dashboardAddress location) "ping"
    )


update : Location -> Msg -> Model -> ( Model, Cmd Msg )
update location msg model =
    case msg of
        Tick ->
            ( model
            , WS.send (dashboardAddress location) "ping"
            )

        NewMsg x ->
            ( RD.fromResult x, Cmd.none )


view : Model -> Html Msg
view model =
    LoadingScreen.viewStateFromRemoteData model <| viewState


viewState : State -> Html Msg
viewState state =
    div []
        [ h3 [] [ text "State" ]
        , Html.div [ Html.Attributes.class "row" ]
            [ Html.div [ Html.Attributes.class "col-md-12" ]
                [ Html.a [ Html.Attributes.href "#tree" ]
                    [ Widget.view Widget.Default "Modules" "fa-info-circle" (List.length state.modules.projectModules)
                    ]
                , Html.a [ Html.Attributes.href "#modules" ]
                    [ Widget.view Widget.Default "Imports" "fa-info-circle" (List.length state.modules.dependencies)
                    ]
                ]
            ]
        , Html.div [ Html.Attributes.class "row" ]
            [ Html.div [ Html.Attributes.class "col-md-12" ]
                [ Html.a [ Html.Attributes.href "#messages" ]
                    [ listValueWidget "Messages" state.messages
                    ]
                , Html.a [ Html.Attributes.href "#dependencies" ]
                    [ listValueWidget "Unused dependencies" state.unusedDependencies
                    ]
                ]
            ]
        ]


listValueWidget : String -> List a -> Html Msg
listValueWidget title x =
    let
        ( t, i ) =
            if List.isEmpty x then
                ( Widget.Success, "fa-check-circle-o" )
            else
                ( Widget.Error, " fa-times-circle-o" )
    in
    Widget.view t title i (List.length x)
