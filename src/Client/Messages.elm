module Client.Messages exposing (viewAll)

import Analyser.Messages.Types exposing (GroupedMessages, Message, MessageStatus(Fixing, Outdated))
import Analyser.Messages.Util as Messages
import Dict
import Html exposing (Html, a, div, h5, li, span, strong, text, ul)
import Html.Attributes exposing (style)
import Html.Events exposing (onClick)


viewAll : (Message -> a) -> GroupedMessages -> Html a
viewAll f messages =
    ul
        [ style
            [ ( "list-style", "none" )
            , ( "padding", "0" )
            ]
        ]
        (messages
            |> Dict.map
                (\title m ->
                    div [] (h5 [] [ text title ] :: List.indexedMap (\n x -> view (f x) n x) m)
                )
            |> Dict.values
        )


view : a -> Int -> Message -> Html a
view focus n x =
    li
        [ style
            [ ( "margin", "10px" )
            , ( "padding", "10px" )
            , ( "border", "1px solid #ccc" )
            , ( "border-radius", "3px" )
            , ( "background"
              , if x.status == Fixing then
                    "#dff0d8"
                else
                    "#fafafa"
              )
            , ( "opacity"
              , if x.status == Outdated then
                    ".5"
                else
                    "1.0"
              )
            ]
        ]
        [ div [ style [ ( "display", "table-row" ) ] ]
            [ a
                [ onClick focus
                , style
                    [ ( "cursor", "pointer" )
                    , ( "display", "table-cell" )
                    , ( "padding-right", "20px" )
                    , ( "font-size", "200%" )
                    , ( "vertical-align", "middle" )
                    ]
                ]
                [ strong []
                    [ text <| (++) "#" <| toString <| n + 1 ]
                ]
            , span
                [ style [ ( "display", "table-cell" ) ] ]
                [ text <| Messages.asString x.data ]
            ]
        ]
