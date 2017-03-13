module Client.View exposing (panel, panelWithFooter)

{-| Provides helper functions for common view elements.
-}

import Html exposing (Html)
import Html.Attributes as Html


panel : String -> Html msg -> Html msg
panel title content =
    panelWithFooter title content Nothing


panelWithFooter : String -> Html msg -> Maybe (Html msg) -> Html msg
panelWithFooter title content maybeFooter =
    Html.div
        [ Html.class "col-lg-6" ]
        [ Html.div
            [ Html.class "panel panel-default" ]
            [ Html.div [ Html.class "panel-heading" ]
                [ Html.text title ]
            , Html.div [ Html.class "panel-body" ]
                [ content ]
            , panelFooter maybeFooter
            ]
        ]


panelFooter : Maybe (Html msg) -> Html msg
panelFooter maybeContent =
    case maybeContent of
        Just content ->
            Html.div [ Html.class "panel-footer" ]
                [ content ]

        Nothing ->
            Html.text ""
