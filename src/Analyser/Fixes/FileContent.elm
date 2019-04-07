module Analyser.Fixes.FileContent exposing (getCharAtLocation, getStringAtRange, replaceLines, replaceLocationWith, replaceRangeWith, updateRange)

import Elm.Syntax.Range exposing (Location, Range)
import List.Extra as List


patchRange : Range -> Range
patchRange rawRange =
    { start =
        { column = rawRange.start.column - 1
        , row = rawRange.start.row - 1
        }
    , end =
        { column = rawRange.end.column - 1
        , row = rawRange.end.row - 1
        }
    }


updateRange : Range -> (String -> String) -> String -> String
updateRange rawRange patch content =
    let
        range =
            patchRange rawRange

        rows =
            content
                |> String.split "\n"

        beforeRows =
            range.start.row

        afterRows =
            range.end.row

        linesBefore =
            List.take beforeRows rows

        rowPrePartTakeFn =
            String.left range.start.column

        rowPostPartTakeFn =
            String.dropLeft range.end.column

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

        newBefore =
            String.join "\n" (linesBefore ++ [ rowPrePart ])

        newAfter =
            String.join "\n" (rowPostPart :: postRows)

        toPatch =
            content
                |> String.dropLeft (String.length newBefore)
                |> String.dropRight (String.length newAfter)
    in
    String.concat
        [ newBefore
        , patch toPatch
        , newAfter
        ]


replaceRangeWith : Range -> String -> String -> String
replaceRangeWith range newValue input =
    updateRange range (always newValue) input


patchLocation : Location -> Location
patchLocation { column, row } =
    { column = column - 1, row = row - 1 }


replaceLocationWith : Location -> String -> String -> String
replaceLocationWith pair x input =
    let
        { row, column } =
            patchLocation pair

        rows =
            input
                |> String.split "\n"

        lineUpdater target =
            String.concat
                [ String.left column target
                , x
                , String.dropLeft (column + 1) target
                ]
    in
    rows
        |> List.updateIfIndex ((==) row) lineUpdater
        |> String.join "\n"


getCharAtLocation : Location -> String -> Maybe String
getCharAtLocation pair input =
    let
        { row, column } =
            patchLocation pair
    in
    input
        |> String.split "\n"
        |> List.drop row
        |> List.head
        |> Maybe.map (String.dropLeft column >> String.left 1)


getStringAtRange : Range -> String -> String
getStringAtRange r input =
    let
        { start, end } =
            patchRange r

        trimLast i line =
            if i == end.row then
                String.left end.column line

            else
                line

        trimFirst i line =
            if i == 0 then
                String.dropLeft start.column line

            else
                line
    in
    input
        |> String.split "\n"
        |> List.take (end.row + 1)
        |> List.indexedMap trimLast
        |> List.drop start.row
        |> List.indexedMap trimFirst
        |> String.concat


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
            , List.drop (end + 1) lines
            ]
