module Analyser.Fixes.UnnecessaryParens exposing (fixer)

import Analyser.Messages.Types exposing (MessageData(UnnecessaryParens))
import AST.Ranges exposing (Range, Location)
import Tuple3
import AST.Types exposing (File)
import Analyser.Fixes.FileContent as FileContent
import Analyser.Fixes.Base exposing (Fixer)


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
fixContent { start, end } ( fileName, content ) =
    let
        startChar =
            FileContent.getCharAtLocation start content

        endCharLoc =
            if end.column <= -2 then
                { end
                    | column = content |> String.split "\n" |> List.drop (end.row - 1) |> List.head |> Maybe.withDefault "" |> String.length |> flip (-) 2
                    , row = end.row - 1
                }
            else
                { end | column = end.column - 1 }

        endChar =
            FileContent.getCharAtLocation endCharLoc content
    in
        case ( startChar, endChar ) of
            ( Just "(", Just ")" ) ->
                content
                    |> FileContent.replaceLocationWith start " "
                    |> FileContent.replaceLocationWith endCharLoc ""
                    |> (,) fileName
                    |> Ok

            _ ->
                Err "Could not locate parens to replace"
