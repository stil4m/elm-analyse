module AST.Ranges exposing (Location, Range, rangeToString, getRange, emptyRange, encode, decode)

import Json.Decode as JD exposing (Decoder)
import Json.Encode as JE exposing (Value)


type alias Location =
    { row : Int, column : Int }


type alias Range =
    { start : Location, end : Location }


decode : Decoder Range
decode =
    JD.list JD.int
        |> JD.andThen
            (\l ->
                case l of
                    [ a, b, c, d ] ->
                        JD.succeed { start = { row = a, column = b }, end = { row = c, column = d } }

                    _ ->
                        JD.fail "Invalid range"
            )


encode : Range -> Value
encode { start, end } =
    JE.list
        [ JE.int start.row
        , JE.int start.column
        , JE.int end.row
        , JE.int end.column
        ]


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
