module Tests exposing (all)

import ASTUtil.PatternOptimizerTests
import Analyser.Checks.DuplicateImportTests
import Analyser.Checks.DuplicateImportedVariableTests
import Analyser.Checks.DuplicateRecordFieldUpdateTests
import Analyser.Checks.ExposeAllTests
import Analyser.Checks.FunctionInLetTests
import Analyser.Checks.ImportAllTests
import Analyser.Checks.ListOperatorsTests
import Analyser.Checks.MultiLineRecordFormattingTests
import Analyser.Checks.NoDebugTests
import Analyser.Checks.NoTopLevelSignatureTests
import Analyser.Checks.NoUncurriedPrefixTests
import Analyser.Checks.NonStaticRegexTests
import Analyser.Checks.OverriddenVariablesTests
import Analyser.Checks.SingleFieldRecordTests
import Analyser.Checks.UnnecessaryListConcatTests
import Analyser.Checks.UnnecessaryParensTests
import Analyser.Checks.UnusedImportAliasesTests
import Analyser.Checks.UnusedImportTests
import Analyser.Checks.UnusedTypeAliasTests
import Analyser.Checks.UnusedVariableTests
import Analyser.Fixes.FileContentTests
import Analyser.Fixes.UnnecessaryParensTests
import Analyser.Fixes.UnusedImportAliasTests
import Analyser.Fixes.UnusedImportTests
import Analyser.Fixes.UnusedImportedVariableTests
import Analyser.Fixes.UnusedTypeAliasTests
import Analyser.InterfaceTest as InterfaceTest
import Test exposing (Test)


all : Test
all =
    Test.concat
        [ Analyser.Checks.SingleFieldRecordTests.all
        , Analyser.Checks.UnusedVariableTests.all
        , Analyser.Checks.DuplicateImportedVariableTests.all
        , Analyser.Checks.DuplicateImportTests.all
        , Analyser.Checks.NonStaticRegexTests.all
        , Analyser.Checks.FunctionInLetTests.all
        , Analyser.Fixes.UnusedTypeAliasTests.all
        , Analyser.Checks.MultiLineRecordFormattingTests.all
        , Analyser.Checks.ListOperatorsTests.all
        , Analyser.Checks.UnusedImportTests.all
        , Analyser.Checks.UnusedImportAliasesTests.all
        , Analyser.Checks.NoUncurriedPrefixTests.all
        , Analyser.Checks.OverriddenVariablesTests.all
        , Analyser.Checks.UnnecessaryParensTests.all
        , Analyser.Checks.NoDebugTests.all
        , Analyser.Checks.UnusedTypeAliasTests.all
        , Analyser.Checks.NoTopLevelSignatureTests.all
        , Analyser.Checks.ImportAllTests.all
        , Analyser.Checks.ExposeAllTests.all
        , Analyser.Checks.UnnecessaryListConcatTests.all
        , Analyser.Checks.DuplicateRecordFieldUpdateTests.all
        , InterfaceTest.all
        , ASTUtil.PatternOptimizerTests.all
        , Analyser.Fixes.FileContentTests.all
        , Analyser.Fixes.UnusedImportedVariableTests.all
        , Analyser.Fixes.UnusedImportAliasTests.all
        , Analyser.Fixes.UnnecessaryParensTests.all
        , Analyser.Fixes.UnusedImportTests.all
        ]
