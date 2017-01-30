module AST.Ranges exposing (Location, Range, rangeToString, getRange, emptyRange)


type alias Location =
    { row : Int, column : Int }


type alias Range =
    { start : Location, end : Location }


rangeToString : Range -> String
rangeToString { start, end } =
    "(" ++ locationToString start ++ "," ++ locationToString end ++ ")"


getRange : List Range -> Range
getRange ranges =
    let
        starts =
            List.map .start ranges |> sortLocations

        ends =
            List.map .end ranges |> sortLocations |> List.reverse
    in
        Maybe.map2 Range (List.head starts) (List.head ends)
            |> Maybe.withDefault emptyRange


emptyRange : Range
emptyRange =
    { start = { row = 0, column = 0 }, end = { row = 0, column = 0 } }


compareLocations : Location -> Location -> Order
compareLocations left right =
    if left.row < right.row then
        LT
    else if right.row < left.row then
        GT
    else
        compare left.column right.column


{-| Could be faster via single fold
-}
sortLocations : List Location -> List Location
sortLocations =
    List.sortWith compareLocations


locationToString : Location -> String
locationToString { row, column } =
    "(" ++ toString row ++ "," ++ toString column ++ ")"
