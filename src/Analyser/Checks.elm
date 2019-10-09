module Analyser.Checks exposing (all, schemas)

import Analyser.Checks.Base exposing (Checker)
import Analyser.Checks.BooleanCase as BooleanCase
import Analyser.Checks.DebugCrash as DebugCrash
import Analyser.Checks.DebugLog as DebugLog
import Analyser.Checks.DropConcatOfLists as DropConcatOfLists
import Analyser.Checks.DropConsOfItemAndList as DropConsOfItemAndList
import Analyser.Checks.DuplicateImport as DuplicateImport
import Analyser.Checks.DuplicateImportedVariable as DuplicateImportedVariable
import Analyser.Checks.ExposeAll as ExposeAll
import Analyser.Checks.FileLoadFailed as FileLoadFailed
import Analyser.Checks.FunctionInLet as FunctionInLet
import Analyser.Checks.ImportAll as ImportAll
import Analyser.Checks.MapNothingToNothing as MapNothingToNothing
import Analyser.Checks.MultiLineRecordFormatting as MultiLineRecordFormatting
import Analyser.Checks.NoTopLevelSignature as NoTopLevelSignature
import Analyser.Checks.NoUncurriedPrefix as NoUncurriedPrefix
import Analyser.Checks.SingleFieldRecord as SingleFieldRecord
import Analyser.Checks.TriggerWords as TriggerWords
import Analyser.Checks.UnnecessaryListConcat as UnnecessaryListConcat
import Analyser.Checks.UnnecessaryLiteralBools as UnnecessaryLiteralBools
import Analyser.Checks.UnnecessaryParens as UnnecessaryParens
import Analyser.Checks.UnnecessaryPortModule as UnnecessaryPortModule
import Analyser.Checks.UnusedImport as UnusedImport
import Analyser.Checks.UnusedImportAlias as UnusedImportAlias
import Analyser.Checks.UnusedImportedVariable as UnusedImportedVariable
import Analyser.Checks.UnusedPatternVariable as UnusedPatternVariable
import Analyser.Checks.UnusedTopLevel as UnusedTopLevel
import Analyser.Checks.UnusedTypeAlias as UnusedTypeAlias
import Analyser.Checks.UnusedValueConstructor as UnusedValueConstructor
import Analyser.Checks.UnusedVariable as UnusedVariable
import Analyser.Checks.UseConsOverConcat as UseConsOverConcat
import Analyser.Messages.Schemas as Schemas exposing (Schemas)


schemas : Schemas
schemas =
    Schemas.buildSchemas (FileLoadFailed.checker :: all)


all : List Checker
all =
    [ UnusedVariable.checker
    , UnusedValueConstructor.checker
    , UnusedImportedVariable.checker
    , UnusedPatternVariable.checker
    , UnusedTopLevel.checker
    , ExposeAll.checker
    , ImportAll.checker
    , NoTopLevelSignature.checker
    , UnnecessaryParens.checker
    , DebugLog.checker
    , DebugCrash.checker
    , DuplicateImport.checker
    , DuplicateImportedVariable.checker
    , UnusedTypeAlias.checker
    , NoUncurriedPrefix.checker
    , UnusedImportAlias.checker
    , UnusedImport.checker
    , UseConsOverConcat.checker
    , DropConcatOfLists.checker
    , DropConsOfItemAndList.checker
    , UnnecessaryListConcat.checker
    , MultiLineRecordFormatting.checker
    , UnnecessaryPortModule.checker
    , FunctionInLet.checker
    , SingleFieldRecord.checker
    , TriggerWords.checker
    , BooleanCase.checker
    , MapNothingToNothing.checker
    , UnnecessaryLiteralBools.checker
    ]
