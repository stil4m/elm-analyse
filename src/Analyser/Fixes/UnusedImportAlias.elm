module Analyser.Fixes.UnusedImportAlias exposing (fixer)

import ASTUtil.Imports as Imports
import Analyser.Checks.UnusedImportAlias as UnusedImportAliasCheck
import Analyser.Fixes.Base exposing (Fixer)
import Analyser.Fixes.FileContent as FileContent
import Analyser.Messages.Data as Data exposing (MessageData)
import Elm.Syntax.File exposing (File)
import Elm.Syntax.Module exposing (Import, Module(..))
import Elm.Syntax.Range as Syntax exposing (Range)


fixer : Fixer
fixer =
    Fixer (.key <| .info <| UnusedImportAliasCheck.checker) fix "Remove alias and format"


fix : ( String, File ) -> MessageData -> Result String String
fix input messageData =
    case Data.getRange "range" messageData of
        Just range ->
            updateImport input range

        Nothing ->
            Err "Invalid message data for fixer UnusedImportAlias"


updateImport : ( String, File ) -> Range -> Result String String
updateImport ( content, ast ) range =
    case Imports.findImportWithRange ast range of
        Just imp ->
            Ok <|
                writeNewImport imp.range { imp | moduleAlias = Nothing } content

        Nothing ->
            Err "Could not locate import for the target range"


writeNewImport : Syntax.Range -> Import -> String -> String
writeNewImport syntaxRange imp i =
    FileContent.replaceLines
        ( syntaxRange.start.row, syntaxRange.end.row )
        (Imports.naiveStringifyImport imp)
        i
