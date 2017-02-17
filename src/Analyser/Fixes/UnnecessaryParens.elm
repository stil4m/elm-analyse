module Analyser.Fixes.UnnecessaryParens exposing (fixer)

import Analyser.Messages.Types exposing (MessageData(UnnecessaryParens))
import AST.Ranges exposing (Range, Location)
import Tuple2
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


fix : List ( String, String, File ) -> MessageData -> List ( String, String )
fix input messageData =
    case messageData of
        UnnecessaryParens fileName range ->
            input
                |> List.filter (Tuple3.first >> (==) fileName)
                |> List.head
                |> Maybe.map (Tuple3.init >> Tuple2.mapSecond (fixContent range) >> List.singleton)
                |> Maybe.withDefault []

        _ ->
            []


fixContent : Range -> String -> String
fixContent { start, end } content =
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

            _ ->
                content
