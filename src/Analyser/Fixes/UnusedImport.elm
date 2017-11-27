module Analyser.Fixes.UnusedImport exposing (fixer)

import ASTUtil.Imports as Imports
import Analyser.Checks.UnusedImport
import Analyser.Fixes.Base exposing (Fixer)
import Analyser.Fixes.FileContent as FileContent
import Analyser.Messages.Data as Data exposing (MessageData)
import Elm.Syntax.File exposing (File)
import Elm.Syntax.Range exposing (Range)


fixer : Fixer
fixer =
    Fixer canFix fix "Remove unused import"


canFix : String
canFix =
    Analyser.Checks.UnusedImport.checker |> .info |> .key


fix : ( String, File ) -> MessageData -> Result String String
fix input messageData =
    case Data.getRange "range" messageData of
        Just range ->
            removeImport input range

        _ ->
            Err "Invalid message data for fixer UnformattedFile"


removeImport : ( String, File ) -> Range -> Result String String
removeImport ( content, ast ) range =
    case Imports.findImportWithRange ast range of
        Just imp ->
            Ok (FileContent.replaceRangeWith imp.range "" content)

        Nothing ->
            Err "Could not locate import for the target range"
