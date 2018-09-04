module Analyser.Fixes.UnusedImportAliasTests exposing (all)

import Analyser.Checks.UnusedImportAlias
import Analyser.Fixes.Base exposing (Fixer, Patch(..))
import Analyser.Fixes.TestUtil exposing (testFix)
import Analyser.Fixes.UnusedImportAlias exposing (fixer)
import Analyser.Messages.Data as Data
import Elm.Parser as Parser
import Elm.Processing as Processing
import Expect
import Test exposing (Test, describe, only, test)


fixOnOneLine =
    ( "fixOnOneLine"
    , """module Foo exposing (..)

import Bar as B exposing (bar, other)

foo = bar 1
"""
    , """module Foo exposing (..)

import Bar exposing (bar, other)

foo = bar 1
"""
    )


all : Test
all =
    testFix "Analyser.Fixes.UnnecessaryParens"
        Analyser.Checks.UnusedImportAlias.checker
        Analyser.Fixes.UnusedImportAlias.fixer
        [ fixOnOneLine
        ]
