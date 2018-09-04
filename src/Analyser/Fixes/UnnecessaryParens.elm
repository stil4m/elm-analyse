module Analyser.Fixes.UnnecessaryParens exposing (fixer)

import Analyser.Checks.UnnecessaryParens as UnnecessaryParensCheck
import Analyser.Fixes.Base exposing (Fixer, Patch(..))
import Analyser.Fixes.FileContent as FileContent
import Analyser.Messages.Data as Data exposing (MessageData)
import Elm.Syntax.File exposing (File)
import Elm.Syntax.Range exposing (Range)


fixer : Fixer
fixer =
    Fixer (.key <| .info <| UnnecessaryParensCheck.checker)
        fix
        "Remove and format"


fix : ( String, File ) -> MessageData -> Patch
fix input messageData =
    case Data.getRange "range" messageData of
        Just range ->
            input
                |> (Tuple.first >> fixContent range)

        Nothing ->
            IncompatibleData


fixContent : Range -> String -> Patch
fixContent range content =
    let
        { start, end } =
            range

        endLoc =
            { row = end.row, column = end.column - 1 }

        startChar =
            FileContent.getCharAtLocation start content

        endChar =
            FileContent.getCharAtLocation endLoc content
    in
    case ( startChar, endChar ) of
        ( Just "(", Just ")" ) ->
            content
                |> FileContent.replaceLocationWith start " "
                |> FileContent.replaceLocationWith endLoc ""
                |> Patched

        _ ->
            Error "Could not locate parens to replace"
