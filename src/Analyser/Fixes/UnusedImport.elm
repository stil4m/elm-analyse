module Analyser.Fixes.UnusedImport exposing (fixer)

import ASTUtil.Imports as Imports
import Analyser.Fixes.Base exposing (Fixer)
import Analyser.Fixes.FileContent as FileContent
import Analyser.Messages.Range as Range exposing (Range)
import Analyser.Messages.Types exposing (MessageData(UnusedImport))
import Elm.Syntax.File exposing (File)


fixer : Fixer
fixer =
    Fixer canFix fix


canFix : MessageData -> Bool
canFix message =
    case message of
        UnusedImport _ _ _ ->
            True

        _ ->
            False


fix : List ( String, String, File ) -> MessageData -> Result String (List ( String, String ))
fix input messageData =
    case messageData of
        UnusedImport _ _ range ->
            case List.head input of
                Nothing ->
                    Err "No input for fixer UnusedImportAlias"

                Just triple ->
                    removeImport triple range

        _ ->
            Err "Invalid message data for fixer UnformattedFile"


removeImport : ( String, String, File ) -> Range -> Result String (List ( String, String ))
removeImport ( fileName, content, ast ) range =
    case Imports.findImportWithRange ast (Range.asSyntaxRange range) of
        Just imp ->
            Ok
                [ ( fileName
                  , FileContent.replaceLines
                        ( imp.range.start.row, imp.range.end.row )
                        ""
                        content
                  )
                ]

        Nothing ->
            Err "Could not locate import for the target range"
