module Analyser.Fixes.UnnecessaryParens exposing (fix)

import Analyser.Messages.Types exposing (MessageData(UnnecessaryParens))
import AST.Ranges exposing (Range, Location)
import Tuple2
import List.Extra as List


fix : List ( String, String ) -> MessageData -> List ( String, String )
fix input messageData =
    case messageData of
        UnnecessaryParens fileName range ->
            input
                |> List.filter (Tuple.first >> (==) fileName)
                |> List.head
                |> Maybe.map (Tuple2.mapSecond (fixContent range) >> List.singleton)
                |> Maybe.withDefault []

        _ ->
            []


fixContent : Range -> String -> String
fixContent { start, end } content =
    let
        startChar =
            getCharAtLocation start content

        endCharLoc =
            if end.column <= -2 then
                { end
                    | column = content |> String.split "\n" |> List.drop (end.row) |> List.head |> Maybe.withDefault "" |> String.length
                    , row = end.row - 1
                }
            else
                { end | column = end.column - 1 }

        endChar =
            getCharAtLocation endCharLoc content
    in
        case ( startChar, endChar ) of
            ( Just "(", Just ")" ) ->
                content
                    |> replaceLocationWith start " "
                    |> replaceLocationWith endCharLoc ""

            _ ->
                content


replaceLocationWith : Location -> String -> String -> String
replaceLocationWith loc x input =
    let
        rows =
            input
                |> String.split "\n"

        lineUpdater target =
            String.concat
                [ String.left (loc.column + 1) target
                , x
                , String.dropLeft (loc.column + 2) target
                ]
    in
        rows
            |> List.updateIfIndex ((==) loc.row) lineUpdater
            |> String.join "\n"


getCharAtLocation : Location -> String -> Maybe String
getCharAtLocation loc input =
    input
        |> String.split "\n"
        |> List.drop loc.row
        |> List.head
        |> Maybe.map (String.dropLeft (loc.column + 1) >> String.left 1)
