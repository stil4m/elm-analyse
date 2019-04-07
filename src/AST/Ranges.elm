module AST.Ranges exposing (containsRange, emptyRange, orderByStart, rangeToString)

import Elm.Syntax.Range exposing (Location, Range)


orderByStart : Range -> Range -> Order
orderByStart r1 r2 =
    if r1.start.row /= r2.start.row then
        compare r1.start.row r2.start.row

    else
        compare r1.start.column r2.start.column


rangeToString : Range -> String
rangeToString { start, end } =
    "(" ++ locationToString start ++ "," ++ locationToString end ++ ")"


emptyRange : Range
emptyRange =
    { start = { row = 0, column = 0 }, end = { row = 0, column = 0 } }


locationToString : Location -> String
locationToString { row, column } =
    "(" ++ String.fromInt row ++ "," ++ String.fromInt column ++ ")"


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
