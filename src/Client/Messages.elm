module Client.Messages exposing (viewAll)

import Analyser.Messages.Types exposing (Message, MessageStatus(Fixing, Outdated))
import Analyser.Messages.Util as Messages
import Html exposing (Html, li, div, a, strong, text, span, ul)
import Html.Attributes exposing (style)
import Html.Events exposing (onClick)


viewAll : (Message -> a) -> List Message -> Html a
viewAll f messages =
    ul
        [ style
            [ ( "list-style", "none" )
            , ( "padding", "0" )
            ]
        ]
        (List.indexedMap (\n x -> view (f x) n x) messages)


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
