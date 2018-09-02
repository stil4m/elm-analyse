module Docs.Html exposing (content, pre)

import Html
import Html.Attributes as Html


content : List (Html.Html msg) -> Html.Html msg
content x =
    Html.div [ Html.style "margin-top" "20px", Html.style "margin-bottom" "60px" ]
        [ Html.div [ Html.class "container" ]
            x
        ]


pre : List (Html.Html msg) -> Html.Html msg
pre x =
    Html.div
        [ Html.style "border" "3px solid #ddd", Html.style "padding" "10px 20px 0 20px" ]
        [ Html.pre [] x ]
