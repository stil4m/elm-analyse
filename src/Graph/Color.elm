module Graph.Color exposing (Color, fallback, list)


type alias Color =
    String


fallback : Color
fallback =
    "#f00"


{-| List of decent colors
@see https://material.io/guidelines/style/color.html#color-color-palette
-}
list : List Color
list =
    [ "#F44336"
    , "#E91E63"
    , "#9C27B0"
    , "#673AB7"
    , "#3F51B5"
    , "#2196F3"
    , "#03A9F4"
    , "#00BCD4"
    , "#009688"
    , "#4CAF50"
    , "#8BC34A"
    , "#FF9800"
    ]
