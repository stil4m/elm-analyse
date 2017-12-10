module Analyser.Fixes.UnnecessaryParens exposing (fixer)

import Analyser.Checks.UnnecessaryParens as UnnecessaryParensCheck
import Analyser.Fixes.Base exposing (Fixer)
import Analyser.Fixes.FileContent as FileContent
import Analyser.Messages.Data as Data exposing (MessageData)
import Elm.Syntax.File exposing (File)
import Elm.Syntax.Range exposing (Range)


fixer : Fixer
fixer =
    Fixer (.key <| .info <| UnnecessaryParensCheck.checker)
        fix
        "Remove and format"


fix : ( String, File ) -> MessageData -> Result String String
fix input messageData =
    case Data.getRange "range" messageData of
        Just range ->
            input
                |> (Tuple.first >> fixContent range)

        Nothing ->
            Err "Invalid message data for fixer UnnecessaryParens"


fixContent : Range -> String -> Result String String
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
                    |> flip (-) 2
                )
            else if end.column == -1 then
                ( end.row - 2
                , lines
                    |> List.drop (end.row - 2)
                    |> List.head
                    |> Maybe.withDefault ""
                    |> String.length
                    |> flip (-) 2
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
                |> Ok

        _ ->
            Err "Could not locate parens to replace"
