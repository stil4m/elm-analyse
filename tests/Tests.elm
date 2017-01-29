module Tests exposing (..)

import Interfaces.InterfaceTest as InterfaceTest
import Interfaces.DependencyTests as DependencyTests
import Analyser.PostProcessingTests as PostProcessingTests
import Test exposing (Test)
import Parser.Tests as ParserTests
import Analyser.Checks.UnusedVariableTests
import Analyser.Checks.NotExposeAllTests


all : Test
all =
    Test.concat
        [ Analyser.Checks.NotExposeAllTests.all
        , Analyser.Checks.UnusedVariableTests.all
        , InterfaceTest.all
        , DependencyTests.all
        , PostProcessingTests.all
        , ParserTests.all
        ]
