module Analyser.Checks.DuplicateImportedVariableTests exposing (all)

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
                [ { start = { row = 3, column = 35 }, end = { row = 3, column = 39 } }
                , { start = { row = 3, column = 23 }, end = { row = 3, column = 27 } }
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
                [ { start = { row = 4, column = 28 }, end = { row = 4, column = 32 } }
                , { start = { row = 3, column = 23 }, end = { row = 3, column = 27 } }
                ]
      ]
    )


sameNameConstructor : ( String, String, List MessageData )
sameNameConstructor =
    ( "sameNameConstructor"
    , """module Bar exposing (..)

import Html exposing (Html(..))

foo = 1
"""
    , []
    )


all : Test
all =
    CTU.build "Analyser.Checks.DuplicateImportedVariable"
        DuplicateImportedVariable.checker
        [ duplicateSameModule
        , duplicateDifferentModuleAlias
        , sameNameConstructor
        ]
