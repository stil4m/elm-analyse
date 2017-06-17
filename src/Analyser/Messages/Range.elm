module Analyser.Messages.Range exposing (Range, RangeContext, context, build, encode, decode, rangeToString, emptyRange, orderByStart, compareRangeStarts, asSyntaxRange, toTuple)

import Elm.Syntax.Range as Syntax
import Dict exposing (Dict)
import Json.Decode as JD exposing (Decoder)
import Json.Encode as JE exposing (Value)
import AST.Ranges as AstRanges


type Range
    = Range Syntax.Range Syntax.Range


type RangeContext
    = Context (Dict Int Int)


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
    String.split "\n" input
        |> List.indexedMap (\x y -> ( x, String.length y ))
        |> Dict.fromList
        |> Context


orderByStart : Range -> Range -> Order
orderByStart (Range r1 _) (Range r2 _) =
    AstRanges.orderByStart r1 r2


compareRangeStarts : Range -> Range -> Order
compareRangeStarts (Range r1 _) (Range r2 _) =
    AstRanges.compareRangeStarts r1 r2


asSyntaxRange : Range -> Syntax.Range
asSyntaxRange (Range _ parsed) =
    parsed


build : Syntax.Range -> Range
build ({ start, end } as parsed) =
    if start.row == 1 then
        Range
            { start = { row = start.row - 1, column = start.column }
            , end = { row = end.row - 1, column = end.column }
            }
            parsed
    else
        Range
            { start = { row = start.row, column = start.column + 1 }
            , end = { row = end.row, column = end.column + 1 }
            }
            parsed
