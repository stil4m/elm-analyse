module Tests exposing (..)

import Analyser.InterfaceTest as InterfaceTest
import Analyser.PostProcessingTests as PostProcessingTests
import Test exposing (Test)
import Parser.Tests as ParserTests
import Analyser.Checks.NoSignatureTests
import Analyser.Checks.UnusedVariableTests
import Analyser.Checks.NotExposeAllTests
import Analyser.Checks.NoImportAllTests
import Analyser.Checks.UnnecessaryParensTests
import Analyser.Checks.NoDebugTests
import Analyser.Checks.DuplicateImportsTests
import Analyser.Checks.UnusedTypeAliasesTests
import Analyser.Checks.OverriddenVariablesTests
import Analyser.Checks.NoUncurriedPrefixTests
import Analyser.Checks.UnusedImportAliasesTests
import Analyser.Checks.UnusedImportsTests
import Analyser.Fixes.UnusedImportedVariableTests


all : Test
all =
    Test.concat
        [ Analyser.Fixes.UnusedImportedVariableTests.all
          -- , Analyser.Checks.UnusedImportsTests.all
          -- , Analyser.Checks.UnusedImportAliasesTests.all
          -- , Analyser.Checks.NoUncurriedPrefixTests.all
          -- , Analyser.Checks.UnusedVariableTests.all
          -- , Analyser.Checks.OverriddenVariablesTests.all
          -- , Analyser.Checks.UnnecessaryParensTests.all
          -- , Analyser.Checks.DuplicateImportsTests.all
          -- , Analyser.Checks.NoDebugTests.all
          -- , Analyser.Checks.UnusedTypeAliasesTests.all
          -- , Analyser.Checks.NoSignatureTests.all
          -- , Analyser.Checks.NoImportAllTests.all
          -- , Analyser.Checks.NotExposeAllTests.all
          -- , InterfaceTest.all
          -- , PostProcessingTests.all
          -- , ParserTests.all
        ]
