module Client.View.BreadCrumb exposing (Item, view)

import Html exposing (Html)
import Html.Attributes as Html
import Html.Events exposing (onClick)


type alias Item msg =
    { title : String
    , color : String
    , msg : msg
    }


view : String -> List (Item msg) -> Html msg
view activeItem list =
    Html.ul [ Html.class "breadcrumb" ]
        (List.map itemView list
            ++ [ li "active" (Html.text activeItem) ]
        )


itemView : Item msg -> Html msg
itemView item =
    li "" (Html.a [ onClick item.msg ] [ Html.text item.title ])


li : String -> Html msg -> Html msg
li class content =
    Html.li [ Html.class ("breadcrumb-item " ++ class) ] [ content ]
