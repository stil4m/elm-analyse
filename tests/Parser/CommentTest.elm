module Parser.CommentTest exposing (..)

import Expect
import Parser.CombineTestUtil exposing (..)
import Parser.Comments as Parser
import Parser.State as State exposing (emptyState)
import Test exposing (..)


all : Test
all =
    describe "ModuleTests"
        [ test "singleLineComment" <|
            \() ->
                parseStateToMaybe emptyState "--bar" Parser.singleLineComment
                    |> Maybe.map Tuple.first
                    |> Expect.equal (Just ())
        , test "singleLineComment state" <|
            \() ->
                parseStateToMaybe emptyState "--bar" Parser.singleLineComment
                    |> Maybe.map (Tuple.second >> State.getComments)
                    |> Expect.equal (Just [ ( "--bar", { start = { row = 1, column = 0 }, end = { row = 1, column = 5 } } ) ])
        , test "singleLineComment does not include new line" <|
            \() ->
                parseFullStringWithNullState "--bar\n" Parser.singleLineComment
                    |> Expect.equal Nothing
        , test "multilineComment" <|
            \() ->
                parseStateToMaybe emptyState "{-foo\nbar-}" Parser.multilineComment
                    |> Maybe.map Tuple.first
                    |> Expect.equal (Just ())
        , test "multilineComment" <|
            \() ->
                parseStateToMaybe emptyState "{-foo\nbar-}" Parser.multilineComment
                    |> Maybe.map (Tuple.second >> State.getComments)
                    |> Expect.equal (Just [ ( "{-foo\nbar-}", { start = { row = 1, column = 0 }, end = { row = 2, column = 5 } } ) ])
        , test "nested multilineComment only open" <|
            \() ->
                parseFullStringWithNullState "{- {- -}" Parser.multilineComment
                    |> Expect.equal Nothing
        , test "nested multilineComment open and close" <|
            \() ->
                parseFullStringWithNullState "{- {- -} -}" Parser.multilineComment
                    |> Expect.equal (Just ())
        ]
