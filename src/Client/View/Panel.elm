module Client.View.Panel exposing
    ( HeaderButton(..)
    , Width(..)
    , documentationButton
    , view
    , viewWithFooter
    )

{-| Provides helper functions panels.
-}

import Html exposing (Html)
import Html.Attributes as Html


type Width
    = WidthFull
    | WidthHalf


type HeaderButton
    = Documentation String
    | NoButton


documentationButton : String -> HeaderButton
documentationButton path =
    Documentation ("https://stil4m.github.io/elm-analyse/#features/" ++ path)


view : Width -> String -> HeaderButton -> Html msg -> Html msg
view panelWidth title button content =
    viewWithFooter panelWidth title button content Nothing


viewWithFooter : Width -> String -> HeaderButton -> Html msg -> Maybe (Html msg) -> Html msg
viewWithFooter panelWidth title button content maybeFooter =
    Html.div
        [ classForWidth panelWidth ]
        [ Html.div
            [ Html.class "panel panel-default" ]
            [ Html.div [ Html.class "panel-heading" ]
                [ Html.text title, headerButton button ]
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


headerButton : HeaderButton -> Html msg
headerButton button =
    case button of
        Documentation href ->
            Html.a
                [ Html.href href, Html.style "float" "right" ]
                [ Html.i [ Html.class "fa fa-book" ] []
                ]

        NoButton ->
            Html.text ""


classForWidth : Width -> Html.Attribute msg
classForWidth panelWidth =
    case panelWidth of
        WidthFull ->
            Html.class "col-lg-12"

        WidthHalf ->
            Html.class "col-lg-6"
