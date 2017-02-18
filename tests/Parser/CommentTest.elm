module Parser.CommentTest exposing (..)

import Parser.Comments as Parser
import Test exposing (..)
import Expect
import Parser.CombineTestUtil exposing (..)


all : Test
all =
    describe "ModuleTests"
        [ test "singleLineComment" <|
            \() ->
                parseFullStringWithNullState "--bar" Parser.singleLineComment
                    |> Expect.equal (Just "--bar")
        , test "singleLineComment does not include new line" <|
            \() ->
                parseFullStringWithNullState "--bar\n" Parser.singleLineComment
                    |> Expect.equal Nothing
        , test "multilineComment" <|
            \() ->
                parseFullStringWithNullState "{-foo\nbar-}" Parser.multilineComment
                    |> Expect.equal (Just "{-foo\nbar-}")
        , test "nested multilineComment only open" <|
            \() ->
                parseFullStringWithNullState "{- {- -}" Parser.multilineComment
                    |> Expect.equal Nothing
        , test "nested multilineComment open and close" <|
            \() ->
                parseFullStringWithNullState "{- {- -} -}" Parser.multilineComment
                    |> Expect.equal (Just "{- {- -} -}")
        ]
