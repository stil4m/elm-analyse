module Analyser.Checks.UnusedImportAliasTests exposing (all, noUsageForAlias, usedAsQualified, usedAsQualifiedInPattern, usedInTypeAlias, usedInTypeReference)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.UnusedImportAlias as UnusedImportAlias
import Analyser.Messages.Data as Data exposing (MessageData)
import Test exposing (Test)


noUsageForAlias : ( String, String, List MessageData )
noUsageForAlias =
    ( "noUsageForAlias"
    , """module Foo exposing (..)

import Bar as B

foo = (+) 1 2
"""
    , [ Data.init "foo"
            |> Data.addModuleName "moduleName" [ "B" ]
            |> Data.addRange "range"
                { start = { row = 3, column = 1 }, end = { row = 3, column = 16 } }
      ]
    )


usedAsQualified : ( String, String, List MessageData )
usedAsQualified =
    ( "usedAsQualified"
    , """module Foo exposing (..)

import Bar as B

foo = B.add 1

"""
    , []
    )


usedAsQualifiedInPattern : ( String, String, List MessageData )
usedAsQualifiedInPattern =
    ( "usedAsQualifiedInPattern"
    , """module Main exposing (..)

import X as Y


z a =
    case a of
        Y.Z ->
            1
"""
    , []
    )


usedInTypeReference : ( String, String, List MessageData )
usedInTypeReference =
    ( "usedInTypeReference"
    , """module Foo exposing (..)

import Bar as B

foo : B.Thing
foo = bar

"""
    , []
    )


usedInTypeAlias : ( String, String, List MessageData )
usedInTypeAlias =
    ( "usedInTypeAlias"
    , """module Foo exposing (..)

import Bar as B

type alias Thing = { name : B.Name }


"""
    , []
    )


usedAsQualifiedWithNestedRecordAccess : ( String, String, List MessageData )
usedAsQualifiedWithNestedRecordAccess =
    ( "usedAsQualifiedWithNestedRecordAccess"
    , """module Foo exposing (..)

import Bar as B

foo = B.math.add 1

"""
    , []
    )


all : Test
all =
    CTU.build "Analyser.Checks.UnusedImportAlias"
        UnusedImportAlias.checker
        [ noUsageForAlias
        , usedAsQualified
        , usedAsQualifiedInPattern
        , usedInTypeReference
        , usedInTypeAlias
        , usedAsQualifiedWithNestedRecordAccess
        ]
