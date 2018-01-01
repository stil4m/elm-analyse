module Analyser.Fixes.MultiLineRecordFormatting exposing (fixer)

import Analyser.Checks.MultiLineRecordFormatting as MultiLineRecordFormattingCheck
import Analyser.Fixes.Base exposing (Fixer)
import Analyser.Fixes.FileContent as FileContent
import Analyser.Messages.Data as Data exposing (MessageData)
import Elm.Syntax.File exposing (File)
import Elm.Syntax.Range exposing (Range)
import Regex


fixer : Fixer
fixer =
    Fixer (.key <| .info <| MultiLineRecordFormattingCheck.checker) fix "Rewrite over multiple lines and format"


fix : ( String, File ) -> MessageData -> Result String String
fix input messageData =
    case Data.getRange "range" messageData of
        Just range ->
            (Tuple.first >> fixContent range) input
                |> Ok

        _ ->
            Err "Invalid message data for fixer UnformattedFile"


commaAndIdentifierRegex : Regex.Regex
commaAndIdentifierRegex =
    Regex.regex ",\\s+[a-z][a-zA-Z0-9_]*'?\\s+:"


replacement : Regex.Match -> String
replacement { match } =
    "\n " ++ match


fixContent : Range -> String -> String
fixContent range content =
    content
        |> FileContent.updateRange
            range
            (Regex.replace (Regex.AtMost 1) commaAndIdentifierRegex replacement)
