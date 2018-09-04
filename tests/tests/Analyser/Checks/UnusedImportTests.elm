module Analyser.Checks.UnusedImportTests exposing (all)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.UnusedImport as UnusedImport
import Analyser.Messages.Data as Data exposing (MessageData)
import Test exposing (Test)


usedAsQualified : ( String, String, List MessageData )
usedAsQualified =
    ( "usedAsQualified"
    , """module Foo exposing (..)

import Bar

foo = Bar.add 1

"""
    , []
    )


usedAsQualifiedInPattern : ( String, String, List MessageData )
usedAsQualifiedInPattern =
    ( "usedAsQualifiedInPattern"
    , """module Main exposing (..)

import Bar


z a =
    case a of
        Bar.Z ->
            1
"""
    , []
    )


usedInTypeReference : ( String, String, List MessageData )
usedInTypeReference =
    ( "usedInTypeReference"
    , """module Foo exposing (..)

import Bar

foo : Bar.Thing
foo = bar

"""
    , []
    )


usedInTypeAlias : ( String, String, List MessageData )
usedInTypeAlias =
    ( "usedInTypeAlias"
    , """module Foo exposing (..)

import Bar

type alias Thing = { name : Bar.Name }


"""
    , []
    )


unusedButHasAlias : ( String, String, List MessageData )
unusedButHasAlias =
    ( "unusedButHasAlias"
    , """module Foo exposing (..)

import Bar as B

foo = 1

"""
    , []
    )


unusedButHasExposing : ( String, String, List MessageData )
unusedButHasExposing =
    ( "unusedButHasExposing"
    , """module Foo exposing (..)

import Bar exposing (baz)

foo = 1

"""
    , []
    )


unusedImport : ( String, String, List MessageData )
unusedImport =
    ( "unusedImport"
    , """module Foo exposing (..)

import Bar

foo = 1

"""
    , [ Data.init "foo"
            |> Data.addModuleName "moduleName" [ "Bar" ]
            |> Data.addRange "range"
                { start = { row = 3, column = 1 }, end = { row = 3, column = 11 } }
      ]
    )


all : Test
all =
    CTU.build "Analyser.Checks.UnusedImport"
        UnusedImport.checker
        [ usedAsQualified
        , usedAsQualifiedInPattern
        , usedInTypeReference
        , usedInTypeAlias
        , unusedButHasAlias
        , unusedButHasExposing
        , unusedImport
        ]
