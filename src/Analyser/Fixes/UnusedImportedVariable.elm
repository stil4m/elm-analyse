module Analyser.Fixes.UnusedImportedVariable exposing (fixer)

import ASTUtil.Imports as Imports
import Analyser.Fixes.Base exposing (Fixer)
import Analyser.Fixes.FileContent as FileContent
import Analyser.Messages.Range as Range exposing (Range)
import Analyser.Messages.Types exposing (MessageData(UnusedImportedVariable))
import Elm.Syntax.File exposing (..)
import Elm.Syntax.Module exposing (..)
import Elm.Syntax.Range as Syntax


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


fix : List ( String, String, File ) -> MessageData -> Result String (List ( String, String ))
fix input messageData =
    case messageData of
        UnusedImportedVariable _ _ range ->
            case List.head input of
                Nothing ->
                    Err "No input for fixer UnusedImportedVariable"

                Just triple ->
                    removeImport triple range

        _ ->
            Err "Invalid message data for fixer UnusedImportedVariable"


removeImport : ( String, String, File ) -> Range -> Result String (List ( String, String ))
removeImport ( fileName, content, ast ) range =
    case Imports.findImportWithRange ast (Range.asSyntaxRange range) of
        Just imp ->
            Ok
                [ ( fileName
                  , writeNewImport imp.range (Imports.removeRangeFromImport (Range.asSyntaxRange range) imp) content
                  )
                ]

        Nothing ->
            Err "Could not locate import for the target range"


writeNewImport : Syntax.Range -> Import -> String -> String
writeNewImport syntaxRange imp i =
    FileContent.replaceLines
        ( syntaxRange.start.row, syntaxRange.end.row )
        (Imports.naiveStringifyImport imp)
        i
