module Analyser.Fixes.FileContent exposing (..)

import Elm.Syntax.Range exposing (Range)
import List.Extra as List


updateRange : Range -> String -> (String -> String) -> String
updateRange range content patch =
    let
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
            String.dropLeft (range.end.column + 1)

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
    updateRange range input (always newValue)


replaceLocationWith : ( Int, Int ) -> String -> String -> String
replaceLocationWith ( row, column ) x input =
    let
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


getCharAtLocation : ( Int, Int ) -> String -> Maybe String
getCharAtLocation ( row, column ) input =
    input
        |> String.split "\n"
        |> List.drop row
        |> List.head
        |> Maybe.map (String.dropLeft column >> String.left 1)


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
