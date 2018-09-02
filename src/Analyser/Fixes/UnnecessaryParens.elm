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

        startChar =
            FileContent.getCharAtLocation ( start.row, start.column ) content

        lines =
            content
                |> String.split "\n"

        endCharLoc =
            if end.column <= -2 then
                ( end.row - 1
                , lines
                    |> List.drop (end.row - 1)
                    |> List.head
                    |> Maybe.withDefault ""
                    |> String.length
                    |> (\a -> (-) a 2)
                )

            else if end.column == -1 then
                ( end.row - 2
                , lines
                    |> List.drop (end.row - 2)
                    |> List.head
                    |> Maybe.withDefault ""
                    |> String.length
                    |> (\a -> (-) a 2)
                )

            else
                ( end.row, end.column - 1 )

        endChar =
            FileContent.getCharAtLocation endCharLoc content
    in
    case ( startChar, endChar ) of
        ( Just "(", Just ")" ) ->
            content
                |> FileContent.replaceLocationWith ( start.row, start.column ) " "
                |> FileContent.replaceLocationWith endCharLoc ""
                |> Patched

        _ ->
            Error "Could not locate parens to replace"
