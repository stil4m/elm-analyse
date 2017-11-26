module Analyser.Checks.DuplicateImportedVariableTests exposing (..)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.DuplicateImportedVariable as DuplicateImportedVariable
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Range as Range
import Test exposing (Test)


duplicateSameModule : ( String, String, List MessageData )
duplicateSameModule =
    ( "duplicateSameModule"
    , """module Bar exposing (..)

import Html exposing (Html, text, Html)

foo = 1
"""
    , [ Data.init "foo"
            |> Data.addModuleName "moduleName" [ "Html" ]
            |> Data.addVarName "varName" "Html"
            |> Data.addRanges "ranges"
                [ Range.manual
                    { start = { row = 2, column = 34 }, end = { row = 2, column = 38 } }
                    { start = { row = 2, column = 33 }, end = { row = 2, column = 37 } }
                , Range.manual
                    { start = { row = 2, column = 22 }, end = { row = 2, column = 26 } }
                    { start = { row = 2, column = 21 }, end = { row = 2, column = 25 } }
                ]
      ]
    )


duplicateDifferentModuleAlias : ( String, String, List MessageData )
duplicateDifferentModuleAlias =
    ( "duplicateDifferentModuleAlias"
    , """module Bar exposing (..)

import Html exposing (Html)
import Html as H exposing (Html)

foo = 1
"""
    , [ Data.init "foo"
            |> Data.addModuleName "moduleName" [ "Html" ]
            |> Data.addVarName "varName" "Html"
            |> Data.addRanges "ranges"
                [ Range.manual
                    { start = { row = 3, column = 27 }, end = { row = 3, column = 31 } }
                    { start = { row = 3, column = 26 }, end = { row = 3, column = 30 } }
                , Range.manual
                    { start = { row = 2, column = 22 }, end = { row = 2, column = 26 } }
                    { start = { row = 2, column = 21 }, end = { row = 2, column = 25 } }
                ]
      ]
    )


sameNameConstructor : ( String, String, List MessageData )
sameNameConstructor =
    ( "sameNameConstructor"
    , """module Bar exposing (..)

import Html exposing (Html(Html))

foo = 1
"""
    , []
    )


doubleSameConstructor : ( String, String, List MessageData )
doubleSameConstructor =
    ( "doubleSameConstructor"
    , """module Bar exposing (..)

import Maybe exposing (Maybe(Just, Just))

foo = 1
"""
    , [ Data.init "foo"
            |> Data.addModuleName "moduleName" [ "Maybe" ]
            |> Data.addVarName "varName" "Just"
            |> Data.addRanges "ranges"
                [ Range.manual
                    { start = { row = 2, column = 35 }, end = { row = 2, column = 39 } }
                    { start = { row = 2, column = 34 }, end = { row = 2, column = 38 } }
                , Range.manual
                    { start = { row = 2, column = 29 }, end = { row = 2, column = 33 } }
                    { start = { row = 2, column = 28 }, end = { row = 2, column = 32 } }
                ]
      ]
    )


all : Test
all =
    CTU.build "Analyser.Checks.DuplicateImportedVariable"
        DuplicateImportedVariable.checker
        [ duplicateSameModule
        , duplicateDifferentModuleAlias
        , sameNameConstructor
        , doubleSameConstructor
        ]
