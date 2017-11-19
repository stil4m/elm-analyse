module Analyser.Fixes.UnusedPatternVariable exposing (fixer)

import ASTUtil.PatternOptimizer as PatternOptimizer
import ASTUtil.Patterns as Patterns
import Analyser.Checks.UnusedPatternVariable as UnusedPatternVariableCheck
import Analyser.Fixes.Base exposing (Fixer)
import Analyser.Fixes.FileContent as FileContent
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Range as Range exposing (Range)
import Elm.Syntax.File exposing (File)
import Elm.Writer as Writer


fixer : Fixer
fixer =
    Fixer (.key <| .info <| UnusedPatternVariableCheck.checker) fix "Optimize pattern and format"


fix : ( String, File ) -> MessageData -> Result String String
fix input messageData =
    case Data.getRange "range" messageData of
        Just range ->
            fixPattern input range

        Nothing ->
            Err "Invalid message data for fixer UnusedPatternVariable"


fixPattern : ( String, File ) -> Range -> Result String String
fixPattern ( content, ast ) range =
    case Patterns.findParentPattern ast (Range.asSyntaxRange range) of
        Just parentPattern ->
            Ok <|
                FileContent.replaceRangeWith
                    (PatternOptimizer.patternRange parentPattern)
                    (Writer.writePattern (PatternOptimizer.optimize (Range.asSyntaxRange range) parentPattern)
                        |> Writer.write
                    )
                    content

        Nothing ->
            Err "Could not find location to replace unused variable in pattern"
