module Analyser.Fixes.UnusedImportAlias exposing (fixer)

import Analyser.Messages.Types exposing (MessageData(UnusedImportAlias))
import ASTUtil.Imports as Imports
import Analyser.Fixes.FileContent as FileContent
import Analyser.Fixes.Base exposing (Fixer)
import Elm.Syntax.File exposing (..)
import Elm.Syntax.Range exposing (..)
import Elm.Syntax.Module exposing (..)


fixer : Fixer
fixer =
    Fixer canFix fix


canFix : MessageData -> Bool
canFix message =
    case message of
        UnusedImportAlias _ _ _ ->
            True

        _ ->
            False


fix : List ( String, String, File ) -> MessageData -> Result String (List ( String, String ))
fix input messageData =
    case messageData of
        UnusedImportAlias _ _ range ->
            case List.head input of
                Nothing ->
                    Err "No input for fixer UnusedImportAlias"

                Just triple ->
                    updateImport triple range

        _ ->
            Err "Invalid message data for fixer UnusedImportAlias"


updateImport : ( String, String, File ) -> Range -> Result String (List ( String, String ))
updateImport ( fileName, content, ast ) range =
    case Imports.findImportWithRange ast range of
        Just imp ->
            Ok
                [ ( fileName
                  , writeNewImport imp.range { imp | moduleAlias = Nothing } content
                  )
                ]

        Nothing ->
            Err "Could not locate import for the target range"


writeNewImport : Range -> Import -> String -> String
writeNewImport r imp i =
    FileContent.replaceLines
        ( r.start.row, r.end.row )
        (Imports.naiveStringifyImport imp)
        i
