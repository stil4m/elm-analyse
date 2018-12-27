module Client.Dashboard exposing (view)

import Analyser.State as State
import Client.Routing as Routing
import Client.State
import Client.View.Widget as Widget
import Html exposing (Html, div)
import Html.Attributes


view : Client.State.State -> Html msg
view state =
    Client.State.view state <|
        viewState


viewState : State.State -> Html msg
viewState state =
    div [ Html.Attributes.style "padding-top" "20px" ]
        [ Html.div [ Html.Attributes.class "row" ]
            [ Html.div [ Html.Attributes.class "col-md-12" ]
                [ Html.a [ Html.Attributes.href (Routing.toUrl Routing.FileTree) ]
                    [ Widget.view Widget.Default "Modules" "fa-info-circle" (String.fromInt <| List.length state.modules.projectModules)
                    ]
                , Html.a [ Html.Attributes.href (Routing.toUrl Routing.Modules) ]
                    [ Widget.view Widget.Default "Imports" "fa-info-circle" (String.fromInt <| List.length state.modules.dependencies)
                    ]
                ]
            ]
        , Html.div [ Html.Attributes.class "row" ]
            [ Html.div [ Html.Attributes.class "col-md-12" ]
                [ Html.a [ Html.Attributes.href (Routing.toUrl Routing.Messages) ]
                    [ listValueWidget "Messages" state.messages
                    ]
                , Html.a [ Html.Attributes.href (Routing.toUrl Routing.Dependencies) ]
                    [ listValueWidget "Unused dependencies" state.dependencies.unused
                    ]
                ]
            ]
        ]


listValueWidget : String -> List a -> Html msg
listValueWidget title x =
    let
        ( t, i ) =
            if List.isEmpty x then
                ( Widget.Success, "fa-check-circle-o" )

            else
                ( Widget.Error, " fa-times-circle-o" )
    in
    Widget.view t title i (String.fromInt <| List.length x)
