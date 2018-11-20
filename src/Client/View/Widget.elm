module Client.View.Widget exposing (Category(..), view)

import Html exposing (Html)
import Html.Attributes as Html


type Category
    = Default
    | Error
    | Success
    | Warning


view : Category -> String -> String -> String -> Html msg
view category title icon value =
    Html.div [ Html.class "col-lg-6 col-md-6" ]
        [ Html.div [ Html.class ("panel panel-" ++ colorForCategory category) ]
            [ Html.div [ Html.class "panel-heading" ]
                [ Html.div [ Html.class "row" ]
                    [ Html.div [ Html.class "col-xs-3" ]
                        [ Html.i [ Html.class ("fa fa-5x " ++ icon) ] []
                        ]
                    , Html.div [ Html.class "col-xs-9 text-right" ]
                        [ Html.div [ Html.class "huge" ]
                            [ Html.text value ]
                        , Html.div []
                            [ Html.text title ]
                        ]
                    ]
                ]
            ]
        ]


colorForCategory : Category -> String
colorForCategory category =
    -- see https://blackrockdigital.github.io/startbootstrap-sb-admin-2/pages/index.html
    case category of
        Default ->
            "primary"

        Error ->
            "red"

        Success ->
            "green"

        Warning ->
            "yellow"
