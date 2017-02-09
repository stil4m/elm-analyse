module Analyser.Checks.UnusedImportAliasesTests exposing (..)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.UnusedImportAliases as UnusedImportAliases
import Analyser.Messages exposing (..)
import Test exposing (Test)


noUsageForAlias : ( String, String, List Message )
noUsageForAlias =
    ( "noUsageForAlias"
    , """module Foo exposing (..)
import Bar as B

foo = (+) 1 2
"""
    , [ UnusedImportAlias "./foo.elm" [ "B" ] { start = { row = 1, column = -1 }, end = { row = 2, column = -2 } }
      ]
    )


usedAsQualified : ( String, String, List Message )
usedAsQualified =
    ( "usedAsQualified"
    , """module Foo exposing (..)

import Bar as B

foo = B.add 1

"""
    , []
    )


usedAsQualifiedInPattern : ( String, String, List Message )
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


usedInTypeReference : ( String, String, List Message )
usedInTypeReference =
    ( "usedInTypeReference"
    , """module Foo exposing (..)

import Bar as B

foo : B.Thing
foo = bar

"""
    , []
    )


usedInTypeAlias : ( String, String, List Message )
usedInTypeAlias =
    ( "usedInTypeAlias"
    , """module Foo exposing (..)

import Bar as B

type alias Thing = { name : B.Name }


"""
    , []
    )


all : Test
all =
    CTU.build "Analyser.Checks.UnusedImportAliasesTests"
        UnusedImportAliases.scan
        [ noUsageForAlias
        , usedAsQualified
        , usedAsQualifiedInPattern
        , usedInTypeReference
        , usedInTypeAlias
        ]
