module Tests exposing (..)

import Analyser.InterfaceTest as InterfaceTest
import Analyser.PostProcessingTests as PostProcessingTests
import Test exposing (Test)
import Parser.Tests as ParserTests
import Analyser.Checks.NoTopLevelSignatureTests
import Analyser.Checks.UnusedVariableTests
import Analyser.Checks.ExposeAllTests
import Analyser.Checks.ImportAllTests
import Analyser.Checks.UnnecessaryParensTests
import Analyser.Checks.NoDebugTests
import Analyser.Checks.DuplicateImportTests
import Analyser.Checks.UnusedTypeAliasesTests
import Analyser.Checks.OverriddenVariablesTests
import Analyser.Checks.NoUncurriedPrefixTests
import Analyser.Checks.UnusedImportAliasesTests
import Analyser.Checks.UnusedImportsTests
import Analyser.Fixes.UnusedImportedVariableTests
import Analyser.Fixes.UnusedImportAliasTests
import ASTUtil.PatternOptimizerTests
import Analyser.Fixes.FileContentTests
import Analyser.Checks.ListOperatorsTests
import Analyser.Checks.UnnecessaryListConcatTests
import ASTUtil.WriterTests


all : Test
all =
    Test.concat
        [ Analyser.Checks.ListOperatorsTests.all
        , Analyser.Fixes.FileContentTests.all
        , Analyser.Fixes.UnusedImportedVariableTests.all
        , Analyser.Fixes.UnusedImportAliasTests.all
        , Analyser.Checks.UnusedImportsTests.all
        , Analyser.Checks.UnusedImportAliasesTests.all
        , Analyser.Checks.NoUncurriedPrefixTests.all
        , Analyser.Checks.UnusedVariableTests.all
        , Analyser.Checks.OverriddenVariablesTests.all
        , Analyser.Checks.UnnecessaryParensTests.all
        , Analyser.Checks.DuplicateImportTests.all
        , Analyser.Checks.NoDebugTests.all
        , Analyser.Checks.UnusedTypeAliasesTests.all
        , Analyser.Checks.NoTopLevelSignatureTests.all
        , Analyser.Checks.ImportAllTests.all
        , Analyser.Checks.ExposeAllTests.all
        , Analyser.Checks.UnnecessaryListConcatTests.all
        , InterfaceTest.all
        , PostProcessingTests.all
        , ParserTests.all
        , ASTUtil.PatternOptimizerTests.all
        , ASTUtil.WriterTests.all
        ]
