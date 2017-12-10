module Analyser.Fixes.UnusedImportedVariable exposing (fixer)

import ASTUtil.Imports as Imports
import Analyser.Checks.UnusedImportedVariable as UnusedImportedVariableCheck
import Analyser.Fixes.Base exposing (Fixer)
import Analyser.Fixes.FileContent as FileContent
import Analyser.Messages.Data as Data exposing (MessageData)
import Elm.Syntax.File exposing (File)
import Elm.Syntax.Module exposing (Import, Module(..))
import Elm.Syntax.Range as Syntax exposing (Range)


fixer : Fixer
fixer =
    Fixer (.key <| .info <| UnusedImportedVariableCheck.checker)
        fix
        "Remove variable from from import list and format"


fix : ( String, File ) -> MessageData -> Result String String
fix input messageData =
    case Data.getRange "range" messageData of
        Just range ->
            removeImport input range

        Nothing ->
            Err "Invalid message data for fixer UnusedImportedVariable"


removeImport : ( String, File ) -> Range -> Result String String
removeImport ( content, ast ) range =
    case Imports.findImportWithRange ast range of
        Just imp ->
            Ok <|
                writeNewImport imp.range (Imports.removeRangeFromImport range imp) content

        Nothing ->
            Err "Could not locate import for the target range"


writeNewImport : Syntax.Range -> Import -> String -> String
writeNewImport syntaxRange imp i =
    FileContent.replaceLines
        ( syntaxRange.start.row, syntaxRange.end.row )
        (Imports.naiveStringifyImport imp)
        i
