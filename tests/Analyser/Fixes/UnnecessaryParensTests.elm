module Analyser.Fixes.UnnecessaryParensTests exposing (all)

import Test exposing (Test, describe, test)
import Analyser.Fixes.UnnecessaryParens exposing (fixer)
import Analyser.Checks.UnnecessaryParens exposing (checker)
import Analyser.Fixes.TestUtil exposing (testFix)


fixInFile : ( String, String, String )
fixInFile =
    ( "fixInFile"
    , """module Foo

f =
    (1)

g =
    2"""
    , """module Foo

f =
     1

g =
    2"""
    )


fixOnLastLineWithoutNewLine : ( String, String, String )
fixOnLastLineWithoutNewLine =
    ( "fixOnLastLineWithoutNewLine"
    , """module Foo

f =
  (1)"""
    , """module Foo

f =
   1"""
    )


fixOnLastLineWithNewLine : ( String, String, String )
fixOnLastLineWithNewLine =
    ( "fixOnLastLineWithNewLine"
    , """module Foo

f =
    (1)
"""
    , """module Foo

f =
     1
"""
    )


all : Test
all =
    testFix "Analyser.Fixes.UnusedImportAlias"
        Analyser.Checks.UnnecessaryParens.checker
        Analyser.Fixes.UnnecessaryParens.fixer
        [ fixInFile
        , fixOnLastLineWithoutNewLine
        , fixOnLastLineWithNewLine
        ]
