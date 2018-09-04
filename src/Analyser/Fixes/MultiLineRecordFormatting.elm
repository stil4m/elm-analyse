module Analyser.Fixes.MultiLineRecordFormatting exposing (fixer)

import Analyser.Checks.MultiLineRecordFormatting as MultiLineRecordFormattingCheck
import Analyser.Fixes.Base exposing (Fixer, Patch(..))
import Analyser.Fixes.FileContent as FileContent
import Analyser.Messages.Data as Data exposing (MessageData)
import Elm.Syntax.File exposing (File)
import Elm.Syntax.Range exposing (Range)
import Regex


fixer : Fixer
fixer =
    Fixer (.key <| .info <| MultiLineRecordFormattingCheck.checker) fix "Rewrite over multiple lines and format"


fix : ( String, File ) -> MessageData -> Patch
fix input messageData =
    case Data.getRange "range" messageData of
        Just range ->
            Patched ((Tuple.first >> fixContent range) input)

        Nothing ->
            IncompatibleData


commaAndIdentifierRegex : Maybe Regex.Regex
commaAndIdentifierRegex =
    Regex.fromString ",\\s+[a-z][a-zA-Z0-9_]*'?\\s+:"


replacement : Regex.Match -> String
replacement { match } =
    "\n " ++ match


replacer : String -> String
replacer =
    commaAndIdentifierRegex
        |> Maybe.map (\r -> Regex.replaceAtMost 1 r replacement)
        |> Maybe.withDefault identity


fixContent : Range -> String -> String
fixContent range content =
    FileContent.updateRange range replacer content
