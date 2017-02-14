module Analyser.Fixes.FileContent exposing (..)

import List.Extra as List
import AST.Ranges exposing (Location)


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


replaceLines : ( Int, Int ) -> String -> String -> String
replaceLines ( start, end ) fix input =
    let
        lines =
            String.split "\n" input
    in
        String.join "\n" <|
            List.concat
                [ List.take start lines
                , [ fix ]
                , List.drop end lines
                ]
