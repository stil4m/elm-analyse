module Analyser.Fixes.UnusedImportAlias exposing (fixer)

import Analyser.Messages.Types exposing (MessageData(UnusedImportAlias))
import AST.Types exposing (ModuleName, File, Import, Exposure, ValueConstructorExpose, Expose, ExposedType)
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
        UnusedImportAlias _ _ _ ->
            True

        _ ->
            False


fix : List ( String, String, File ) -> MessageData -> List ( String, String )
fix input messageData =
    case messageData of
        UnusedImportAlias _ moduleName range ->
            case List.head input of
                Nothing ->
                    []

                Just triple ->
                    updateImport triple moduleName range

        _ ->
            []


updateImport : ( String, String, File ) -> ModuleName -> Range -> List ( String, String )
updateImport ( fileName, content, ast ) moduleName range =
    case Imports.findImportWithRange ast range of
        Just imp ->
            [ ( fileName
              , writeNewImport imp.range { imp | moduleAlias = Nothing } content
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
