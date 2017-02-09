module Analyser.Checks.UnusedImportsTests exposing (..)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.UnusedImports as UnusedImports
import Analyser.Messages exposing (..)
import Test exposing (Test)


usedAsQualified : ( String, String, List Message )
usedAsQualified =
    ( "usedAsQualified"
    , """module Foo exposing (..)

import Bar

foo = Bar.add 1

"""
    , []
    )


usedAsQualifiedInPattern : ( String, String, List Message )
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


usedInTypeReference : ( String, String, List Message )
usedInTypeReference =
    ( "usedInTypeReference"
    , """module Foo exposing (..)

import Bar

foo : Bar.Thing
foo = bar

"""
    , []
    )


usedInTypeAlias : ( String, String, List Message )
usedInTypeAlias =
    ( "usedInTypeAlias"
    , """module Foo exposing (..)

import Bar

type alias Thing = { name : Bar.Name }


"""
    , []
    )


unusedButHasAlias : ( String, String, List Message )
unusedButHasAlias =
    ( "unusedButHasAlias"
    , """module Foo exposing (..)

import Bar as B

foo = 1

"""
    , []
    )


unusedButHasExposing : ( String, String, List Message )
unusedButHasExposing =
    ( "unusedButHasAlias"
    , """module Foo exposing (..)

import Bar exposing (baz)

foo = 1

"""
    , []
    )


unusedImport : ( String, String, List Message )
unusedImport =
    ( "unusedButHasAlias"
    , """module Foo exposing (..)

import Bar

foo = 1

"""
    , [ UnusedImport "./foo.elm" [ "Bar" ] { start = { row = 2, column = -1 }, end = { row = 3, column = -2 } }
      ]
    )


all : Test
all =
    CTU.build "Analyser.Checks.UnusedImports"
        UnusedImports.scan
        [ usedAsQualified
        , usedAsQualifiedInPattern
        , usedInTypeReference
        , usedInTypeAlias
        , unusedButHasAlias
        , unusedButHasExposing
        , unusedImport
        ]
