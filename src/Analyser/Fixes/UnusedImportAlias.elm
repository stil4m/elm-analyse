module Analyser.Fixes.UnusedImportAlias exposing (fix)

import Analyser.Messages.Types exposing (MessageData(UnusedImportAlias))
import AST.Types exposing (ModuleName, File, Import, Exposure, ValueConstructorExpose, Expose, ExposedType)
import AST.Ranges as Ranges exposing (Range)
import AST.Imports
import Analyser.Fixes.FileContent as FileContent


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
    let
        maybeImport =
            findImport ast range
    in
        case maybeImport of
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
        (AST.Imports.naiveStringifyImport imp)
        i


findImport : File -> Range -> Maybe Import
findImport ast range =
    ast.imports
        |> List.filter (.range >> Ranges.containsRange range)
        |> List.head
