module Analyser.Fixes.FileContentTests exposing (all)

import Analyser.Fixes.FileContent as FileContent
import Test exposing (Test, test, describe)
import Expect


all : Test
all =
    describe "FileContent"
        [ replaceRangeWithTests ]


{-|
  Col is 0 based, but with a offset of minus 1. Thus 5 means the 7th character
  Row is 0 based.
-}
replaceRangeWithTests : Test
replaceRangeWithTests =
    describe "replaceRangeWith"
        [ test "onSingleLine" <|
            \() ->
                FileContent.replaceRangeWith
                    { start = { row = 1, column = 5 }, end = { row = 1, column = 7 } }
                    "FOO"
                    "abcdefghijk\n1234567890\nabcdefghijk"
                    |> Expect.equal "abcdefghijk\n123456FOO0\nabcdefghijk"
        , test "onMultiline" <|
            \() ->
                FileContent.replaceRangeWith
                    { start = { row = 1, column = 5 }, end = { row = 2, column = 5 } }
                    "FOO"
                    "abcdefghijk\n1234567890\nabcdefghijk"
                    |> Expect.equal "abcdefghijk\n123456FOOhijk"
        , test "onNextlineButStart" <|
            \() ->
                FileContent.replaceRangeWith
                    { start = { row = 1, column = 5 }, end = { row = 2, column = -2 } }
                    "FOO"
                    "abcdefghijk\n1234567890\nabcdefghijk"
                    |> Expect.equal "abcdefghijk\n123456FOO\nabcdefghijk"
        , test "onNextlineButStart2" <|
            \() ->
                FileContent.replaceRangeWith
                    { start = { row = 1, column = 5 }, end = { row = 2, column = -1 } }
                    "FOO"
                    "abcdefghijk\n1234567890\nabcdefghijk"
                    |> Expect.equal "abcdefghijk\n123456FOObcdefghijk"
        ]
