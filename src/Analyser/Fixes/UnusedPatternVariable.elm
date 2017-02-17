module Analyser.Fixes.UnusedPatternVariable exposing (canFix, fix)

import Analyser.Fixes.FileContent as FileContent
import AST.Ranges exposing (Range)
import AST.Types exposing (File, Pattern, Function, Case)
import Analyser.Messages.Types exposing (MessageData(UnusedPatternVariable))
import ASTUtil.PatternOptimizer as PatternOptimizer
import ASTUtil.Patterns as Patterns


canFix : MessageData -> Bool
canFix message =
    case message of
        UnusedPatternVariable _ _ _ ->
            True

        _ ->
            False


fix : List ( String, String, File ) -> MessageData -> List ( String, String )
fix input messageData =
    case messageData of
        UnusedPatternVariable _ value range ->
            case List.head input of
                Nothing ->
                    []

                Just triple ->
                    fixPattern triple value range

        _ ->
            []


fixPattern : ( String, String, File ) -> String -> Range -> List ( String, String )
fixPattern ( fileName, content, ast ) varName range =
    case Debug.log "Parent Pattern" <| Patterns.findParentPattern ast range of
        Just parentPattern ->
            [ ( fileName
              , FileContent.replaceRangeWith
                    (PatternOptimizer.patternRange parentPattern)
                    (Patterns.patternAsString (PatternOptimizer.optimize range parentPattern))
                    content
              )
            ]

        Nothing ->
            []
