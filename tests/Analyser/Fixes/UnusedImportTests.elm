module Analyser.Fixes.UnusedImportTests exposing (all)

import Test exposing (Test, describe, test)
import Analyser.Fixes.UnusedImport exposing (fixer)
import Analyser.Checks.UnusedImport exposing (checker)
import Analyser.Fixes.TestUtil exposing (testFix)


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
    testFix "Analyser.Fixes.UnusedImportTests"
        checker
        fixer
        [ unusedImport
        , unusedImportBetweenOtherImports
        ]
