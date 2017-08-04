module Analyser.Fixes.MultiLineRecordFormatting exposing (fixer)

import Analyser.Fixes.Base exposing (Fixer)
import Analyser.Fixes.FileContent as FileContent
import Analyser.Messages.Range as Range exposing (Range)
import Analyser.Messages.Types exposing (MessageData(MultiLineRecordFormatting))
import Elm.Syntax.File exposing (File)
import Regex
import Tuple3


fixer : Fixer
fixer =
    Fixer canFix fix


canFix : MessageData -> Bool
canFix message =
    case message of
        MultiLineRecordFormatting _ _ ->
            True

        _ ->
            False


fix : List ( String, String, File ) -> MessageData -> Result String (List ( String, String ))
fix input messageData =
    case messageData of
        MultiLineRecordFormatting fileName range ->
            input
                |> List.filter (Tuple3.first >> (==) fileName)
                |> List.map (Tuple3.init >> fixContent range)
                |> Ok

        _ ->
            Err "Invalid message data for fixer UnformattedFile"


commaAndIdentifierRegex : Regex.Regex
commaAndIdentifierRegex =
    Regex.regex ",\\s+[a-z][a-zA-Z0-9_]*'?\\s+:"


replacement : Regex.Match -> String
replacement { match } =
    "\n " ++ match


fixContent : Range -> ( String, String ) -> ( String, String )
fixContent range ( fileName, content ) =
    ( fileName
    , FileContent.updateRange
        (Range.asSyntaxRange range)
        content
        (Regex.replace (Regex.AtMost 1) commaAndIdentifierRegex replacement)
    )
