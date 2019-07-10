module Analyser.Checks.DuplicateImportTests exposing (all)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.DuplicateImport as DuplicateImport
import Analyser.Messages.Data as Data exposing (MessageData)
import Test exposing (Test)


goodImports : ( String, String, List MessageData )
goodImports =
    ( "goodImports"
    , """module Bar exposing (..)

import Baz
import John
import Jake

foo = 1
"""
    , []
    )


badImports : ( String, String, List MessageData )
badImports =
    ( "badImports"
    , """module Bar exposing (..)

import Baz
import John
import Baz

foo = 1
"""
    , [ Data.init "foo"
            |> Data.addModuleName "moduleName" [ "Baz" ]
            |> Data.addRanges "ranges"
                [ { start = { row = 3, column = 1 }, end = { row = 3, column = 11 } }
                , { start = { row = 5, column = 1 }, end = { row = 5, column = 11 } }
                ]
      ]
    )


badImportsTriple : ( String, String, List MessageData )
badImportsTriple =
    ( "badImportsTriple"
    , """module Bar exposing (..)

import Baz
import Baz
import Baz

foo = 1
"""
    , [ Data.init "foo"
            |> Data.addModuleName "moduleName" [ "Baz" ]
            |> Data.addRanges "ranges"
                [ { start = { row = 3, column = 1 }, end = { row = 3, column = 11 } }
                , { start = { row = 4, column = 1 }, end = { row = 4, column = 11 } }
                , { start = { row = 5, column = 1 }, end = { row = 5, column = 11 } }
                ]
      ]
    )


badImportDouble : ( String, String, List MessageData )
badImportDouble =
    ( "badImportDouble"
    , """module Bar exposing (..)

import Baz
import John
import Baz
import John

foo = 1
"""
    , [ Data.init "foo"
            |> Data.addModuleName "moduleName" [ "Baz" ]
            |> Data.addRanges "ranges"
                [ { start = { row = 3, column = 1 }, end = { row = 3, column = 11 } }
                , { start = { row = 5, column = 1 }, end = { row = 5, column = 11 } }
                ]
      , Data.init "foo"
            |> Data.addModuleName "moduleName" [ "John" ]
            |> Data.addRanges "ranges"
                [ { start = { row = 4, column = 1 }, end = { row = 4, column = 12 } }
                , { start = { row = 6, column = 1 }, end = { row = 6, column = 12 } }
                ]
      ]
    )


all : Test
all =
    CTU.build "Analyser.Checks.DuplicateImport"
        DuplicateImport.checker
        [ goodImports
        , badImports
        , badImportsTriple
        , badImportDouble
        ]
