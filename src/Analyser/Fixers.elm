module Analyser.Fixers exposing (all, getFixer)

import Analyser.Fixes.Base exposing (Fixer)
import Analyser.Fixes.DropConsOfItemAndList as DropConsOfItemAndList
import Analyser.Fixes.DuplicateImport as DuplicateImportFixer
import Analyser.Fixes.MultiLineRecordFormatting as MultiLineRecordFormatting
import Analyser.Fixes.UnnecessaryParens as UnnecessaryParensFixer
import Analyser.Fixes.UnusedImport as UnusedImportFixer
import Analyser.Fixes.UnusedImportAlias as UnusedImportAliasFixer
import Analyser.Fixes.UnusedImportedVariable as UnusedImportedVariableFixer
import Analyser.Fixes.UnusedPatternVariable as UnusedPatternVariableFixer
import Analyser.Fixes.UnusedTypeAlias as UnusedTypeAliasFixer
import Analyser.Messages.Types exposing (Message)


getFixer : Message -> Maybe Fixer
getFixer m =
    List.filter (\x -> x.canFix == m.type_) all
        |> List.head


all : List Fixer
all =
    [ UnnecessaryParensFixer.fixer
    , UnusedImportFixer.fixer
    , UnusedImportedVariableFixer.fixer
    , UnusedImportAliasFixer.fixer
    , UnusedPatternVariableFixer.fixer
    , UnusedTypeAliasFixer.fixer
    , MultiLineRecordFormatting.fixer
    , DropConsOfItemAndList.fixer
    , DuplicateImportFixer.fixer
    ]
