module CommentTest exposing (..)

import Parser.Comments as Parser
import Test exposing (..)
import Expect
import CombineTestUtil exposing (..)


{--}
--afasd


all : Test
all =
    describe "ModuleTests"
        [ test "singleLineComment" <|
            \() ->
                parseFullString "--bar" Parser.singleLineComment
                    |> Expect.equal (Just "--bar")
        , test "singleLineComment does not include new line" <|
            \() ->
                parseFullString "--bar\n" Parser.singleLineComment
                    |> Expect.equal Nothing
        , test "multilineComment" <|
            \() ->
                parseFullString "{-foo\nbar-}" Parser.multilineComment
                    |> Expect.equal (Just "{-foo\nbar-}")
        ]
