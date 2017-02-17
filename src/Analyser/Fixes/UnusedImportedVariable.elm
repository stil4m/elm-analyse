module Analyser.Fixes.UnusedImportedVariable exposing (fixer)

import Analyser.Messages.Types exposing (MessageData(UnusedImportedVariable))
import AST.Types exposing (File, Import, Exposure, ValueConstructorExpose, Expose, ExposedType)
import AST.Ranges exposing (Range)
import ASTUtil.Imports as Imports
import Analyser.Fixes.FileContent as FileContent
import Analyser.Fixes.Base exposing (Fixer)


fixer : Fixer
fixer =
    Fixer canFix fix


canFix : MessageData -> Bool
canFix message =
    case message of
        UnusedImportedVariable _ _ _ ->
            True

        _ ->
            False


fix : List ( String, String, File ) -> MessageData -> List ( String, String )
fix input messageData =
    case messageData of
        UnusedImportedVariable _ varName range ->
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
            Imports.findImportWithRange ast range
    in
        case maybeImport of
            Just imp ->
                [ ( fileName
                  , writeNewImport imp.range (Imports.removeRangeFromImport range imp) content
                  )
                ]

            Nothing ->
                []


writeNewImport : Range -> Import -> String -> String
writeNewImport r imp i =
    FileContent.replaceLines
        ( r.start.row, r.end.row )
        (Imports.naiveStringifyImport imp)
        i
