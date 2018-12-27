module Analyser.Fixes.UnusedImport exposing (fixer)

import ASTUtil.Imports as Imports
import Analyser.Checks.UnusedImport
import Analyser.Fixes.Base exposing (Fixer, Patch(..))
import Analyser.Fixes.FileContent as FileContent
import Analyser.Messages.Data as Data exposing (MessageData)
import Elm.Syntax.File exposing (File)
import Elm.Syntax.Node exposing (Node(..))
import Elm.Syntax.Range exposing (Range)


fixer : Fixer
fixer =
    Fixer canFix fix "Remove unused import"


canFix : String
canFix =
    Analyser.Checks.UnusedImport.checker |> .info |> .key


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
        Just (Node r _) ->
            Patched (FileContent.replaceRangeWith r "" content)

        Nothing ->
            Error "Could not locate import for the target range"
