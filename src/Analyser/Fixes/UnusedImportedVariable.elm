module Analyser.Fixes.UnusedImportedVariable exposing (fixer)

import ASTUtil.Imports as Imports
import Analyser.Checks.UnusedImportedVariable as UnusedImportedVariableCheck
import Analyser.Fixes.Base exposing (Fixer, Patch(..))
import Analyser.Fixes.FileContent as FileContent
import Analyser.Messages.Data as Data exposing (MessageData)
import Elm.Syntax.File exposing (File)
import Elm.Syntax.Import exposing (Import)
import Elm.Syntax.Module exposing (Module(..))
import Elm.Syntax.Node exposing (Node(..))
import Elm.Syntax.Range as Syntax exposing (Range)


fixer : Fixer
fixer =
    Fixer (.key <| .info <| UnusedImportedVariableCheck.checker)
        fix
        "Remove variable from from import list and format"


fix : ( String, File ) -> MessageData -> Patch
fix input messageData =
    case Data.getRange "range" messageData of
        Just range ->
            removeImport input range

        Nothing ->
            IncompatibleData


removeImport : ( String, File ) -> Range -> Patch
removeImport ( content, ast ) range =
    case Imports.findImportWithRange ast range of
        Just (Node r imp) ->
            Patched (writeNewImport r (Imports.removeRangeFromImport range imp) content)

        Nothing ->
            Error "Could not locate import for the target range"


writeNewImport : Syntax.Range -> Import -> String -> String
writeNewImport syntaxRange imp i =
    FileContent.replaceLines
        ( syntaxRange.start.row - 1, syntaxRange.end.row - 1 )
        (Imports.naiveStringifyImport imp)
        i
