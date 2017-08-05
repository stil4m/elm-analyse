module Analyser.Fixes.UnnecessaryParens exposing (fixer)

import Analyser.Fixes.Base exposing (Fixer)
import Analyser.Fixes.FileContent as FileContent
import Analyser.Messages.Range as Range exposing (Range)
import Analyser.Messages.Types exposing (MessageData(UnnecessaryParens))
import Elm.Syntax.File exposing (..)
import Tuple3


fixer : Fixer
fixer =
    Fixer canFix fix


canFix : MessageData -> Bool
canFix message =
    case message of
        UnnecessaryParens _ _ ->
            True

        _ ->
            False


fix : List ( String, String, File ) -> MessageData -> Result String (List ( String, String ))
fix input messageData =
    case messageData of
        UnnecessaryParens fileName range ->
            input
                |> List.filter (Tuple3.first >> (==) fileName)
                |> List.head
                |> Maybe.map (Tuple3.init >> fixContent range)
                |> Maybe.map (Result.map List.singleton)
                |> Maybe.withDefault (Err "Could not find the right file to replace the unnecessary parens")

        _ ->
            Err "Invalid message data for fixer UnnecessaryParens"


fixContent : Range -> ( String, String ) -> Result String ( String, String )
fixContent range ( fileName, content ) =
    let
        { start, end } =
            Range.asSyntaxRange range

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
                |> (,) fileName
                |> Ok

        _ ->
            Err "Could not locate parens to replace"
