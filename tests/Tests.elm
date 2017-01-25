module Tests exposing (..)

import Interfaces.InterfaceTest as InterfaceTest
import Interfaces.DependencyTests as DependencyTests
import Parser.Tests as ParserTests
import Test exposing (Test)


all : Test
all =
    Test.concat
        [ InterfaceTest.all
        , DependencyTests.all
          -- , ParserTests.all
        ]
