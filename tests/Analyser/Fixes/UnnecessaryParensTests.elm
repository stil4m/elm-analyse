module Analyser.Fixes.UnnecessaryParensTests exposing (all)

import Analyser.Checks.UnnecessaryParens exposing (checker)
import Analyser.Fixes.TestUtil exposing (testFix)
import Analyser.Fixes.UnnecessaryParens exposing (fixer)
import Test exposing (Test, describe, test)


fixInFile : ( String, String, String )
fixInFile =
    ( "fixInFile"
    , """module Foo exposing (..)

f =
    (1)

g =
    2"""
    , """module Foo exposing (..)

f =
     1

g =
    2"""
    )


fixOnLastLineWithoutNewLine : ( String, String, String )
fixOnLastLineWithoutNewLine =
    ( "fixOnLastLineWithoutNewLine"
    , """module Foo exposing (..)

f =
  (1)"""
    , """module Foo exposing (..)

f =
   1"""
    )


fixOnLastLineWithNewLine : ( String, String, String )
fixOnLastLineWithNewLine =
    ( "fixOnLastLineWithNewLine"
    , """module Foo exposing (..)

f =
    (1)
"""
    , """module Foo exposing (..)

f =
     1
"""
    )


all : Test
all =
    testFix "Analyser.Fixes.UnnecessaryParens"
        Analyser.Checks.UnnecessaryParens.checker
        Analyser.Fixes.UnnecessaryParens.fixer
        [ fixInFile
        , fixOnLastLineWithoutNewLine
        , fixOnLastLineWithNewLine
        ]
