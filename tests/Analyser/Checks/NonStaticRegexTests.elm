module Analyser.Checks.NonStaticRegexTests exposing (..)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.NonStaticRegex as NonStaticRegex
import Analyser.Messages.Range as Range
import Analyser.Messages.Types exposing (..)
import Test exposing (..)


usedRegexWithStaticWithoutImport : ( String, String, List MessageData )
usedRegexWithStaticWithoutImport =
    ( "usedRegexWithStaticWithoutImport"
    , """module Bar exposing (foo)

foo =
    Regex.regex a
"""
    , []
    )


usedRegexWithVariableWithoutImport : ( String, String, List MessageData )
usedRegexWithVariableWithoutImport =
    ( "usedRegexWithVariableWithoutImport"
    , """module Bar exposing (foo)

foo a =
    Regex.regex a
"""
    , []
    )


usedRegexWithStaticAndImport : ( String, String, List MessageData )
usedRegexWithStaticAndImport =
    ( "usedRegexWithStaticAndImport"
    , """module Bar exposing (foo)

import Regex

foo =
    Regex.regex a
"""
    , []
    )


usedRegexWithVariableAndImport : ( String, String, List MessageData )
usedRegexWithVariableAndImport =
    ( "usedRegexWithVariableAndImport"
    , """module Bar exposing (foo)

import Regex

foo a =
    Regex.regex a
"""
    , [ NonStaticRegex "./foo.elm" <|
            Range.manual
                { start = { row = 5, column = 4 }, end = { row = 5, column = 15 } }
                { start = { row = 5, column = 3 }, end = { row = 5, column = 14 } }
      ]
    )


usedRegexWithStaticAsFunctionWithImport : ( String, String, List MessageData )
usedRegexWithStaticAsFunctionWithImport =
    ( "usedRegexWithStaticAsFunctionWithImport"
    , """module Bar exposing (foo)

import Regex exposing (regex)

foo =
    regex a
"""
    , []
    )


usedRegexWithVariableAsFunctionWithImport : ( String, String, List MessageData )
usedRegexWithVariableAsFunctionWithImport =
    ( "usedRegexWithVariableAsFunctionWithImport"
    , """module Bar exposing (foo)

import Regex exposing (regex)

foo a =
    regex a
"""
    , [ NonStaticRegex "./foo.elm" <|
            Range.manual
                { start = { row = 5, column = 4 }, end = { row = 5, column = 9 } }
                { start = { row = 5, column = 3 }, end = { row = 5, column = 8 } }
      ]
    )


usedRegexWithStaticAsFunctionWithoutImport : ( String, String, List MessageData )
usedRegexWithStaticAsFunctionWithoutImport =
    ( "usedRegexWithStaticAsFunctionWithoutImport"
    , """module Bar exposing (foo)


foo =
    regex a
"""
    , []
    )


usedRegexWithVariableAsFunctionWithoutImport : ( String, String, List MessageData )
usedRegexWithVariableAsFunctionWithoutImport =
    ( "usedRegexWithVariableAsFunctionWithoutImport"
    , """module Bar exposing (foo)


foo a =
    regex a
"""
    , []
    )


usedRegexWithVariableAndImportAlias : ( String, String, List MessageData )
usedRegexWithVariableAndImportAlias =
    ( "usedRegexWithVariableAndImportAlias"
    , """module Bar exposing (foo)

import Regex as R

foo a =
    R.regex a
"""
    , [ NonStaticRegex "./foo.elm" <|
            Range.manual
                { start = { row = 5, column = 4 }, end = { row = 5, column = 11 } }
                { start = { row = 5, column = 3 }, end = { row = 5, column = 10 } }
      ]
    )


all : Test
all =
    CTU.build "Analyser.Checks.NonStaticRegex"
        NonStaticRegex.checker
        [ usedRegexWithStaticWithoutImport
        , usedRegexWithVariableWithoutImport
        , usedRegexWithStaticAndImport
        , usedRegexWithVariableAndImport
        , usedRegexWithStaticAsFunctionWithImport
        , usedRegexWithVariableAsFunctionWithImport
        , usedRegexWithStaticAsFunctionWithoutImport
        , usedRegexWithVariableAsFunctionWithoutImport
        , usedRegexWithVariableAndImportAlias
        ]
