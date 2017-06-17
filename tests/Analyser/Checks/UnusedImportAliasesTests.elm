module Analyser.Checks.UnusedImportAliasesTests exposing (..)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.UnusedImportAliases as UnusedImportAliases
import Analyser.Messages.Types exposing (..)
import Test exposing (Test)
import Analyser.Messages.Range as Range


noUsageForAlias : ( String, String, List MessageData )
noUsageForAlias =
    ( "noUsageForAlias"
    , """module Foo exposing (..)

import Bar as B

foo = (+) 1 2
"""
    , [ UnusedImportAlias "./foo.elm" [ "B" ] <|
            Range.manual
                { start = { row = 2, column = 0 }, end = { row = 2, column = 15 } }
                { start = { row = 2, column = -1 }, end = { row = 3, column = -2 } }
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


all : Test
all =
    CTU.build "Analyser.Checks.UnusedImportAliasesTests"
        UnusedImportAliases.checker
        [ noUsageForAlias
        , usedAsQualified
        , usedAsQualifiedInPattern
        , usedInTypeReference
        , usedInTypeAlias
        ]
