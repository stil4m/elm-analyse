module Analyser.Checks.DuplicateImportedVariableTests exposing (..)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.DuplicateImportedVariable as DuplicateImportedVariable
import Analyser.Messages.Data as Data exposing (MessageData)
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
                [ { start = { row = 2, column = 34 }, end = { row = 2, column = 38 } }
                , { start = { row = 2, column = 22 }, end = { row = 2, column = 26 } }
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
                [ { start = { row = 3, column = 27 }, end = { row = 3, column = 31 } }
                , { start = { row = 2, column = 22 }, end = { row = 2, column = 26 } }
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
                [ { start = { row = 2, column = 35 }, end = { row = 2, column = 39 } }
                , { start = { row = 2, column = 29 }, end = { row = 2, column = 33 } }
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
