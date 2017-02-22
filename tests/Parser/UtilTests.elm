module Parser.UtilTests exposing (..)

import Parser.CombineTestUtil exposing (..)
import Expect
import Parser.Util exposing (commentSequence, exactIndentWhitespace, moreThanIndentWhitespace, multiLineCommentWithTrailingSpaces)
import Test exposing (..)
import Parser.State exposing (emptyState, pushIndent)


all : Test
all =
    describe "UtilTest"
        [ test "no whitespace" <|
            \() ->
                parseFullStringState emptyState "" moreThanIndentWhitespace
                    |> Expect.equal Nothing
        , test "just whitespace" <|
            \() ->
                parseFullStringState emptyState " " moreThanIndentWhitespace
                    |> Expect.equal (Just ())
        , test "with newline and higher indent 1" <|
            \() ->
                parseFullStringState emptyState " \n" moreThanIndentWhitespace
                    |> Expect.equal Nothing
        , test "no newlines with state" <|
            \() ->
                parseFullStringState (emptyState |> pushIndent 8) " " moreThanIndentWhitespace
                    |> Expect.equal (Just ())
        , test "with newline and higher indent 2" <|
            \() ->
                parseFullStringState emptyState "\n  " moreThanIndentWhitespace
                    |> Expect.equal (Just ())
        , test "with newline and higher indent 2" <|
            \() ->
                parseFullStringState emptyState " \n " moreThanIndentWhitespace
                    |> Expect.equal (Just ())
        , test "with newline and higher indent 4" <|
            \() ->
                parseFullStringState (emptyState |> pushIndent 1) " \n  " moreThanIndentWhitespace
                    |> Expect.equal (Just ())
        , test "exactIndentWhitespace" <|
            \() ->
                parseFullStringState emptyState " \n" exactIndentWhitespace
                    |> Expect.equal (Just ())
        , test "exactIndentWhitespace multi line" <|
            \() ->
                parseFullStringState emptyState " \n      \n" exactIndentWhitespace
                    |> Expect.equal (Just ())
        , test "exactIndentWhitespace too much" <|
            \() ->
                parseFullStringState emptyState " \n " exactIndentWhitespace
                    |> Expect.equal Nothing
        , test "exactIndentWhitespace with comments" <|
            \() ->
                parseFullStringState emptyState "-- foo\n  --bar\n" exactIndentWhitespace
                    |> Expect.equal (Just ())
        , test "exactIndentWhitespace with comments 2" <|
            \() ->
                parseFullStringState emptyState "\n--x\n{-| foo \n-}\n" exactIndentWhitespace
                    |> Expect.equal (Just ())
        , test "moreThanIndentWhitespace with multiple new lines" <|
            \() ->
                parseFullStringState (emptyState |> pushIndent 2) "\n  \n    \n\n   " moreThanIndentWhitespace
                    |> Expect.equal (Just ())
        , test "exactIndentWhitespace some" <|
            \() ->
                parseFullStringState (emptyState |> pushIndent 2) "\n  \n  " exactIndentWhitespace
                    |> Expect.equal (Just ())
        , test "moreThanIndentWhitespace with comments" <|
            \() ->
                parseFullStringState emptyState "\n --foo\n " moreThanIndentWhitespace
                    |> Expect.equal (Just ())
        , test "moreThanIndentWhitespace with comments" <|
            \() ->
                parseFullStringState emptyState "\n --bar\n " moreThanIndentWhitespace
                    |> Expect.equal (Just ())
        , test "moreThanIndentWhitespace with comments multi empty line preceding" <|
            \() ->
                parseFullStringState emptyState "\n\n --bar\n " moreThanIndentWhitespace
                    |> Expect.equal (Just ())
        , test "exactIndentWhitespace with comments multi empty line preceding" <|
            \() ->
                parseFullStringState emptyState "\n\n --bar\n" exactIndentWhitespace
                    |> Expect.equal (Just ())
        , test "exactIndentWhitespace with multiple new lines" <|
            \() ->
                parseFullStringState (emptyState |> pushIndent 2) "\n  \n    \n\n  " exactIndentWhitespace
                    |> Expect.equal (Just ())
        , test "exactIndentWhitespace with multiple new lines" <|
            \() ->
                parseFullStringState emptyState "-- bar\n " moreThanIndentWhitespace
                    |> Expect.equal (Just ())
        , test "multiLineCommentWithTrailingSpaces" <|
            \() ->
                parseFullStringState emptyState "{- some note -}    " multiLineCommentWithTrailingSpaces
                    |> Expect.equal (Just ())
        , test "exactIndentWhitspace with multiline comment plus trailing whitespace" <|
            \() ->
                parseFullStringState emptyState "\n{- some note -}    \n" exactIndentWhitespace
                    |> Expect.equal (Just ())
        , test "commentSequence" <|
            \() ->
                parseFullStringState emptyState "\n{- some note -}    " commentSequence
                    |> Expect.equal (Just ())
        , test "moreThanIndentWhitespace with multiline comment plus trailing whitespace" <|
            \() ->
                parseFullStringState emptyState "\n{- some note -}    \n " moreThanIndentWhitespace
                    |> Expect.equal (Just ())
        , test "moreThanIndentWhitespace with multiline comment plus trailing whitespace" <|
            \() ->
                parseFullStringState emptyState " {- \"Shoes\" NodeId -}" moreThanIndentWhitespace
                    |> Expect.equal (Just ())
        ]
