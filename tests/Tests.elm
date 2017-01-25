module Tests exposing (..)

import Interfaces.InterfaceTest as InterfaceTest
import Interfaces.DependencyTests as DependencyTests
import Test exposing (Test)
import Parser.Tests as ParserTests


all : Test
all =
    Test.concat
        [ InterfaceTest.all
        , DependencyTests.all
        , ParserTests.all
        ]
