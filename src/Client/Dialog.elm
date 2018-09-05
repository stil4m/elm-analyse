module Client.Dialog exposing (Config, view, map, mapMaybe)

{-| Elm Modal Dialogs.

@docs Config, view, map, mapMaybe

-}

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Maybe exposing (andThen)
import Maybe.Extra exposing (isJust)


{-| Renders a modal dialog whenever you supply a `Config msg`.

To use this, include this view in your _top-level_ view function,
right at the top of the DOM tree, like so:

    type Message
      = ...
      | ...
      | AcknowledgeDialog


    view : -> Model -> Html Message
    view model =
      div
        []
        [ ...
        , ...your regular view code....
        , ...
        , Dialog.view
            (if model.shouldShowDialog then
              Just { closeMessage = Just AcknowledgeDialog
                   , containerClass = Just "your-container-class"
                   , header = Just (text "Alert!")
                   , body = Just (p [] [text "Let me tell you something important..."])
                   , footer = Nothing
                   }
             else
              Nothing
            )
        ]

It's then up to you to replace `model.shouldShowDialog` with whatever
logic should cause the dialog to be displayed, and to handle an
`AcknowledgeDialog` message with whatever logic should occur when the user
closes the dialog.

See the `examples/` directory for examples of how this works for apps
large and small.

-}
view : Maybe (Config msg) -> Html msg
view maybeConfig =
    let
        displayed =
            isJust maybeConfig
    in
    div
        (case
            maybeConfig
                |> Maybe.andThen .containerClass
         of
            Nothing ->
                []

            Just containerClass ->
                [ class containerClass ]
        )
        [ div
            [ classList
                [ ( "modal", True )
                , ( "in", displayed )
                ]
            , Html.Attributes.style "display" <|
                if displayed then
                    "block"

                else
                    "none"
            ]
            [ div [ class "modal-dialog" ]
                [ div [ class "modal-content" ]
                    (case maybeConfig of
                        Nothing ->
                            [ span [] [] ]

                        Just config ->
                            [ wrapHeader config.closeMessage config.header
                            , Maybe.withDefault (span [] []) <| Maybe.map wrapBody config.body
                            , Maybe.withDefault (span [] []) <| Maybe.map wrapFooter config.footer
                            ]
                    )
                ]
            ]
        , backdrop maybeConfig
        ]


wrapHeader : Maybe msg -> Maybe (Html msg) -> Html msg
wrapHeader closeMessage header =
    if closeMessage == Nothing && header == Nothing then
        span [] []

    else
        div [ class "modal-header" ]
            [ Maybe.withDefault (span [] []) <| Maybe.map closeButton closeMessage
            , Maybe.withDefault (span [] []) header
            ]


closeButton : msg -> Html msg
closeButton closeMessage =
    button [ class "close", onClick closeMessage ]
        [ text "x" ]


wrapBody : Html msg -> Html msg
wrapBody body =
    div [ class "modal-body" ]
        [ body ]


wrapFooter : Html msg -> Html msg
wrapFooter footer =
    div [ class "modal-footer" ]
        [ footer ]


backdrop : Maybe (Config msg) -> Html msg
backdrop config =
    div [ classList [ ( "modal-backdrop in", isJust config ) ] ]
        []


{-| The configuration for the dialog you display. The `header`, `body`
and `footer` are all `Maybe (Html msg)` blocks. Those `(Html msg)` blocks can
be as simple or as complex as any other view function.

Use only the ones you want and set the others to `Nothing`.

The `closeMessage` is an optional `Signal.Message` we will send when the user
clicks the 'X' in the top right. If you don't want that X displayed, use `Nothing`.

-}
type alias Config msg =
    { closeMessage : Maybe msg
    , containerClass : Maybe String
    , header : Maybe (Html msg)
    , body : Maybe (Html msg)
    , footer : Maybe (Html msg)
    }


{-| This function is useful when nesting components with the Elm
Architecture. It lets you transform the messages produced by a
subtree.
-}
map : (a -> b) -> Config a -> Config b
map f config =
    { closeMessage = Maybe.map f config.closeMessage
    , containerClass = config.containerClass
    , header = Maybe.map (Html.map f) config.header
    , body = Maybe.map (Html.map f) config.body
    , footer = Maybe.map (Html.map f) config.footer
    }


{-| For convenience, a varient of `map` which assumes you're dealing with a `Maybe (Config a)`, which is often the case.
-}
mapMaybe : (a -> b) -> Maybe (Config a) -> Maybe (Config b)
mapMaybe =
    Maybe.map << map
