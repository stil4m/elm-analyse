module Analyser.Fixes.FileContentTests exposing (all)

import Analyser.Fixes.FileContent as FileContent
import Expect
import Test exposing (Test, describe, only, test)


all : Test
all =
    describe "FileContent"
        [ describe "replaceRangeWith"
            [ test "onSingleLine" <|
                \() ->
                    FileContent.replaceRangeWith
                        { start = { row = 1, column = 6 }, end = { row = 1, column = 8 } }
                        "FOO"
                        "abcdefghijk\n1234567890\nabcdefghijk"
                        |> Expect.equal "abcdefghijk\n123456FOO0\nabcdefghijk"
            , test "onMultiline" <|
                \() ->
                    FileContent.replaceRangeWith
                        { start = { row = 1, column = 6 }, end = { row = 2, column = 6 } }
                        "FOO"
                        "abcdefghijk\n1234567890\nabcdefghijk"
                        |> Expect.equal "abcdefghijk\n123456FOOhijk"
            , test "onNextlineButStart" <|
                \() ->
                    FileContent.replaceRangeWith
                        { start = { row = 1, column = 6 }, end = { row = 1, column = 12 } }
                        "FOO"
                        "abcdefghijk\n1234567890\nabcdefghijk"
                        |> Expect.equal "abcdefghijk\n123456FOO\nabcdefghijk"
            , test "onNextlineButStart2" <|
                \() ->
                    FileContent.replaceRangeWith
                        { start = { row = 1, column = 6 }, end = { row = 2, column = 0 } }
                        "FOO"
                        "abcdefghijk\n1234567890\nabcdefghijk"
                        |> Expect.equal "abcdefghijk\n123456FOObcdefghijk"
            ]
        ]
