module Analyser.Messages.Range exposing (Range, RangeContext, asSyntaxRange, build, compareRangeStarts, context, decode, emptyRange, encode, manual, orderByStart, rangeToString, toTuple)

import AST.Ranges as AstRanges
import Dict exposing (Dict)
import Elm.Syntax.Range as Syntax exposing (Location)
import Json.Decode as JD exposing (Decoder)
import Json.Encode as JE exposing (Value)


type Range
    = Range Syntax.Range Syntax.Range


type RangeContext
    = Context Int (Dict Int Int)


emptyRange : Range
emptyRange =
    Range Syntax.emptyRange Syntax.emptyRange


toTuple : Range -> ( Int, Int, Int, Int )
toTuple (Range r _) =
    ( r.start.row, r.start.column, r.end.row, r.end.column )


encode : Range -> Value
encode (Range real parsed) =
    JE.object
        [ ( "real", Syntax.encode real )
        , ( "parsed", Syntax.encode parsed )
        ]


decode : Decoder Range
decode =
    JD.map2 Range
        (JD.field "real" Syntax.decode)
        (JD.field "parsed" Syntax.decode)


rangeToString : Range -> String
rangeToString (Range real _) =
    AstRanges.rangeToString real


context : String -> RangeContext
context input =
    let
        rows =
            String.split "\n" input

        index =
            rows
                |> List.indexedMap (\x y -> ( x, String.length y ))
                |> Dict.fromList
    in
    Context (List.length rows) index


orderByStart : Range -> Range -> Order
orderByStart (Range r1 _) (Range r2 _) =
    AstRanges.orderByStart r1 r2


compareRangeStarts : Range -> Range -> Order
compareRangeStarts (Range r1 _) (Range r2 _) =
    AstRanges.compareRangeStarts r1 r2


asSyntaxRange : Range -> Syntax.Range
asSyntaxRange (Range _ parsed) =
    parsed


manual : Syntax.Range -> Syntax.Range -> Range
manual =
    Range


build : RangeContext -> Syntax.Range -> Range
build (Context rows rangeContext) ({ start, end } as parsed) =
    if start.row == 1 then
        Range
            { start = { row = start.row - 1, column = start.column }
            , end = realEnd rows rangeContext { row = end.row - 1, column = end.column }
            }
            parsed
    else
        Range
            { start = { row = start.row, column = start.column + 1 }
            , end = realEnd rows rangeContext { row = end.row, column = end.column + 1 }
            }
            parsed


realEnd : Int -> Dict Int Int -> Location -> Location
realEnd rows d e =
    if e.row > rows then
        { e | row = e.row - 2, column = Dict.get (e.row - 2) d |> Maybe.withDefault 0 }
    else if e.column >= 0 then
        e
    else
        { e | row = e.row - 1, column = Dict.get (e.row - 1) d |> Maybe.withDefault 0 }
