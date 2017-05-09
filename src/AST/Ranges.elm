module AST.Ranges exposing (rangeToString, getRange, emptyRange, orderByStart, containsRange, compareRangeStarts)

import Elm.Syntax.Range exposing (Range, Location)


orderByStart : Range -> Range -> Order
orderByStart r1 r2 =
    if r1.start.row /= r2.start.row then
        compare r1.start.row r2.start.row
    else
        compare r1.start.column r2.start.column


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


compareRangeStarts : Range -> Range -> Order
compareRangeStarts a b =
    compareLocations a.start b.start


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


{-| Checks if the second range is the overhauling range on the first range
-}
containsRange : Range -> Range -> Bool
containsRange a b =
    isGte a.start b.start && isGte b.end a.end


isGte : Location -> Location -> Bool
isGte a b =
    if a.row > b.row then
        True
    else if a.row < b.row then
        False
    else
        a.column >= b.column
