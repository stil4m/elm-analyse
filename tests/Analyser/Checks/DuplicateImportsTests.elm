module Analyser.Checks.DuplicateImportsTests exposing (..)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.DuplicateImports as DuplicateImports
import Analyser.Messages exposing (..)
import Test exposing (Test)


goodImports : ( String, String, List Message )
goodImports =
    ( "parensBetweenOperators"
    , """module Bar exposing (..)

import Baz
import John
import Jake

foo = 1
"""
    , []
    )


badImports : ( String, String, List Message )
badImports =
    ( "parensBetweenOperators"
    , """module Bar exposing (..)

import Baz
import John
import Baz

foo = 1
"""
    , [ DuplicateImport "./foo.elm"
            [ "Baz" ]
            [ { start = { row = 2, column = -1 }, end = { row = 3, column = -2 } }
            , { start = { row = 4, column = -1 }, end = { row = 5, column = -2 } }
            ]
      ]
    )


badImportsTripple : ( String, String, List Message )
badImportsTripple =
    ( "badImportsTripple"
    , """module Bar exposing (..)

import Baz
import Baz
import Baz

foo = 1
"""
    , [ DuplicateImport "./foo.elm"
            [ "Baz" ]
            [ { start = { row = 2, column = -1 }, end = { row = 3, column = -2 } }
            , { start = { row = 3, column = -1 }, end = { row = 4, column = -2 } }
            , { start = { row = 4, column = -1 }, end = { row = 5, column = -2 } }
            ]
      ]
    )


badImportDouble : ( String, String, List Message )
badImportDouble =
    ( "badImportDouble"
    , """module Bar exposing (..)

import Baz
import John
import Baz
import John

foo = 1
"""
    , [ DuplicateImport "./foo.elm"
            [ "Baz" ]
            [ { start = { row = 2, column = -1 }, end = { row = 3, column = -2 } }
            , { start = { row = 4, column = -1 }, end = { row = 5, column = -2 } }
            ]
      , DuplicateImport "./foo.elm"
            [ "John" ]
            [ { start = { row = 3, column = -1 }, end = { row = 4, column = -2 } }
            , { start = { row = 5, column = -1 }, end = { row = 6, column = -2 } }
            ]
      ]
    )


all : Test
all =
    CTU.build "Analyser.Checks.DuplicateImportsTests"
        DuplicateImports.scan
        [ goodImports
        , badImports
        , badImportsTripple
        , badImportDouble
        ]
