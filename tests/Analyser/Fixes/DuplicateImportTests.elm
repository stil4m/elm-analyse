module Analyser.Fixes.DuplicateImportTests exposing (all)

import Analyser.Checks.DuplicateImport
import Analyser.Fixes.DuplicateImport
import Analyser.Fixes.TestUtil exposing (testFix)
import Test exposing (Test, only)


badImports : ( String, String, String )
badImports =
    ( "badImports"
    , """module Bar exposing (..)

import Baz
import John
import Baz

foo = 1
"""
    , """module Bar exposing (..)

import Baz
import John


foo = 1
"""
    )


badImportsTriple : ( String, String, String )
badImportsTriple =
    ( "badImportsTriple"
    , """module Bar exposing (..)

import Baz
import Baz
import Baz

foo = 1
"""
    , """module Bar exposing (..)

import Baz



foo = 1
"""
    )


all : Test
all =
    testFix "Analyser.Fixes.DuplicateImport"
        Analyser.Checks.DuplicateImport.checker
        Analyser.Fixes.DuplicateImport.fixer
        [ badImports
        , badImportsTriple
        ]
