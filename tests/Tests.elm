module Tests exposing (..)

import Parser.Tests as ParserTests
import Test exposing (Test)


all : Test
all =
    Test.concat
        [ ParserTests.all
        ]
