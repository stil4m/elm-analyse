module Client.DependenciesPage exposing (view)

import Analyser.State exposing (State)
import Client.State
import Html exposing (Html)


view : Client.State.State -> Html msg
view state =
    Client.State.view state <| viewState


viewState : State -> Html msg
viewState state =
    Html.div []
        [ Html.h3 [] [ Html.text "Unused Dependencies" ]
        , if List.isEmpty state.unusedDependencies then
            Html.i []
                [ Html.text "No unused dependencies" ]
          else
            Html.ul [] (List.map (Html.text >> List.singleton >> Html.li []) state.unusedDependencies)
        ]
