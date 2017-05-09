module Analyser.Fixes.FileContent exposing (..)

import List.Extra as List
import Elm.Syntax.Range exposing (Range, Location)


replaceRangeWith : Range -> String -> String -> String
replaceRangeWith range x input =
    let
        rows =
            input
                |> String.split "\n"

        beforeRows =
            if range.start.column <= -2 then
                range.start.row - 1
            else
                range.start.row

        afterRows =
            if range.end.column <= -2 then
                range.end.row - 1
            else
                range.end.row

        linesBefore =
            List.take beforeRows rows

        rowPrePartTakeFn =
            if range.start.column <= -2 then
                identity
            else
                String.left (range.start.column + 1)

        rowPostPartTakeFn =
            if range.end.column <= -2 then
                always ""
            else
                String.dropLeft (range.end.column + 2)

        rowPrePart =
            List.drop beforeRows rows
                |> List.head
                |> Maybe.map rowPrePartTakeFn
                |> Maybe.withDefault ""

        postRows =
            List.drop (afterRows + 1) rows

        rowPostPart =
            List.drop afterRows rows
                |> List.head
                |> Maybe.map rowPostPartTakeFn
                |> Maybe.withDefault ""
    in
        String.concat
            [ String.join "\n" (linesBefore ++ [ rowPrePart ])
            , x
            , String.join "\n" (rowPostPart :: postRows)
            ]


replaceLocationWith : Location -> String -> String -> String
replaceLocationWith loc x input =
    let
        rows =
            input
                |> String.split "\n"

        lineUpdater target =
            String.concat
                [ String.left (loc.column + 1) target
                , x
                , String.dropLeft (loc.column + 2) target
                ]
    in
        rows
            |> List.updateIfIndex ((==) loc.row) lineUpdater
            |> String.join "\n"


getCharAtLocation : Location -> String -> Maybe String
getCharAtLocation loc input =
    input
        |> String.split "\n"
        |> List.drop loc.row
        |> List.head
        |> Maybe.map (String.dropLeft (loc.column + 1) >> String.left 1)


replaceLines : ( Int, Int ) -> String -> String -> String
replaceLines ( start, end ) fix input =
    let
        lines =
            String.split "\n" input
    in
        String.join "\n" <|
            List.concat
                [ List.take start lines
                , [ fix ]
                , List.drop end lines
                ]
