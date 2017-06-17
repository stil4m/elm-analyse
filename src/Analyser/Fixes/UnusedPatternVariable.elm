module Analyser.Fixes.UnusedPatternVariable exposing (fixer)

import Analyser.Fixes.FileContent as FileContent
import Elm.Syntax.File exposing (File)
import Analyser.Messages.Types exposing (MessageData(UnusedPatternVariable))
import ASTUtil.PatternOptimizer as PatternOptimizer
import ASTUtil.Patterns as Patterns
import Elm.Writer as Writer
import Analyser.Fixes.Base exposing (Fixer)
import Analyser.Messages.Range as Range exposing (Range)


fixer : Fixer
fixer =
    Fixer canFix fix


canFix : MessageData -> Bool
canFix message =
    case message of
        UnusedPatternVariable _ _ _ ->
            True

        _ ->
            False


fix : List ( String, String, File ) -> MessageData -> Result String (List ( String, String ))
fix input messageData =
    case messageData of
        UnusedPatternVariable _ _ range ->
            case List.head input of
                Nothing ->
                    Err "No input for fixer UnusedPatternVariable"

                Just triple ->
                    fixPattern triple range

        _ ->
            Err "Invalid message data for fixer UnusedPatternVariable"


fixPattern : ( String, String, File ) -> Range -> Result String (List ( String, String ))
fixPattern ( fileName, content, ast ) range =
    case Patterns.findParentPattern ast (Range.asSyntaxRange range) of
        Just parentPattern ->
            Ok
                [ ( fileName
                  , FileContent.replaceRangeWith
                        (PatternOptimizer.patternRange parentPattern)
                        (Writer.writePattern (PatternOptimizer.optimize (Range.asSyntaxRange range) parentPattern)
                            |> Writer.write
                        )
                        content
                  )
                ]

        Nothing ->
            Err "Could not find location to replace unused variable in pattern"
