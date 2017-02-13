module Analyser.Fixes.UnusedImportedVariable exposing (fix)

import Analyser.Messages.Types exposing (MessageData(UnusedImportedVariable))
import AST.Types exposing (File, Import, Exposure, ValueConstructorExpose, Expose, ExposedType)
import AST.Ranges as Ranges exposing (Range)
import AST.Imports


fix : List ( String, String, File ) -> MessageData -> List ( String, String )
fix input messageData =
    case messageData of
        UnusedImportedVariable fileName varName range ->
            case List.head input of
                Nothing ->
                    []

                Just triple ->
                    removeImport triple varName range

        _ ->
            []


removeImport : ( String, String, File ) -> String -> Range -> List ( String, String )
removeImport ( fileName, content, ast ) varName range =
    let
        maybeImport =
            findImport ast range
    in
        case maybeImport of
            Just imp ->
                [ ( fileName
                  , writeNewImport imp.range (AST.Imports.removeRangeFromImport range imp) content
                  )
                ]

            Nothing ->
                []


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


writeNewImport : Range -> Import -> String -> String
writeNewImport r imp i =
    replaceLines
        ( r.start.row, r.end.row )
        (AST.Imports.naiveStringifyImport imp)
        i


findImport : File -> Range -> Maybe Import
findImport ast range =
    ast.imports
        |> List.filter (.range >> Ranges.containsRange range)
        |> List.head
