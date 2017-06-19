module Tests exposing (all)

import Analyser.InterfaceTest as InterfaceTest
import Test exposing (Test)
import Analyser.Checks.NoTopLevelSignatureTests
import Analyser.Checks.UnusedVariableTests
import Analyser.Checks.ExposeAllTests
import Analyser.Checks.ImportAllTests
import Analyser.Checks.UnnecessaryParensTests
import Analyser.Checks.NoDebugTests
import Analyser.Checks.DuplicateImportTests
import Analyser.Checks.UnusedTypeAliasTests
import Analyser.Checks.OverriddenVariablesTests
import Analyser.Checks.NoUncurriedPrefixTests
import Analyser.Checks.UnusedImportAliasesTests
import Analyser.Checks.UnusedImportTests
import Analyser.Fixes.UnusedImportedVariableTests
import Analyser.Fixes.UnusedImportAliasTests
import ASTUtil.PatternOptimizerTests
import Analyser.Fixes.FileContentTests
import Analyser.Checks.ListOperatorsTests
import Analyser.Checks.UnnecessaryListConcatTests
import Analyser.Fixes.UnnecessaryParensTests
import Analyser.Fixes.UnusedImportTests
import Analyser.Fixes.UnusedTypeAliasTests
import Analyser.Checks.MultiLineRecordFormattingTests
import Analyser.Checks.NonStaticRegexTests
import Analyser.Checks.FunctionsInLetTests
import Analyser.Checks.DuplicateImportedVariableTests


all : Test
all =
    Test.concat
        [ Analyser.Checks.UnusedVariableTests.all

        -- ,Analyser.Checks.DuplicateImportedVariableTests.all
        -- , Analyser.Checks.DuplicateImportTests.all
        -- , Analyser.Checks.NonStaticRegexTests.all
        -- , Analyser.Checks.FunctionsInLetTests.all
        -- , Analyser.Fixes.UnusedTypeAliasTests.all
        -- , Analyser.Checks.MultiLineRecordFormattingTests.all
        -- , Analyser.Checks.ListOperatorsTests.all
        -- , Analyser.Checks.UnusedImportTests.all
        -- , Analyser.Checks.UnusedImportAliasesTests.all
        -- , Analyser.Checks.NoUncurriedPrefixTests.all
        -- , Analyser.Checks.OverriddenVariablesTests.all
        -- , Analyser.Checks.UnnecessaryParensTests.all
        -- , Analyser.Checks.NoDebugTests.all
        -- , Analyser.Checks.UnusedTypeAliasTests.all
        -- , Analyser.Checks.NoTopLevelSignatureTests.all
        -- , Analyser.Checks.ImportAllTests.all
        -- , Analyser.Checks.ExposeAllTests.all
        -- , Analyser.Checks.UnnecessaryListConcatTests.all
        -- , InterfaceTest.all
        -- , ASTUtil.PatternOptimizerTests.all
        -- , Analyser.Fixes.FileContentTests.all
        -- , Analyser.Fixes.UnusedImportedVariableTests.all
        -- , Analyser.Fixes.UnusedImportAliasTests.all
        -- , Analyser.Fixes.UnnecessaryParensTests.all
        -- , Analyser.Fixes.UnusedImportTests.all
        ]
