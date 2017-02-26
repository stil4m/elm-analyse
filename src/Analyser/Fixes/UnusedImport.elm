module Analyser.Fixes.UnusedImport exposing (fixer)

import Analyser.Messages.Types exposing (MessageData(UnusedImport))
import Analyser.Fixes.Base exposing (Fixer)
import AST.Types exposing (File)
import AST.Ranges exposing (Range)
import ASTUtil.Imports as Imports
import Analyser.Fixes.FileContent as FileContent


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
    case Imports.findImportWithRange ast range of
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
