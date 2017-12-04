module Analyser.Fixes.UnusedImportTests exposing (all)

import Analyser.Checks.UnusedImport exposing (checker)
import Analyser.Fixes.TestUtil exposing (testFix)
import Analyser.Fixes.UnusedImport exposing (fixer)
import Test exposing (Test, only)


unusedImport : ( String, String, String )
unusedImport =
    ( "unusedImport"
    , """module Foo exposing (f)

import A

f =
    1"""
    , """module Foo exposing (f)



f =
    1"""
    )


unusedImportBetweenOtherImports : ( String, String, String )
unusedImportBetweenOtherImports =
    ( "unusedImportBetweenOtherImports"
    , """module Foo exposing (f)

import A
import B
import C

f =
    A.a + C.c"""
    , """module Foo exposing (f)

import A

import C

f =
    A.a + C.c"""
    )


all : Test
all =
    testFix "Analyser.Fixes.UnusedImport"
        checker
        fixer
        [ unusedImport
        , unusedImportBetweenOtherImports
        ]
