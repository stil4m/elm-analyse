module Analyser.Checks.UnusedAliasesTests exposing (..)

import AST.Ranges exposing (emptyRange)
import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.UnusedAliases as UnusedAliases
import Analyser.Messages exposing (..)
import Test exposing (Test)


unusedButExposed : ( String, String, List Message )
unusedButExposed =
    ( "unusedButExposed"
    , """module Foo exposing (Bar)

type alias Bar = Int
"""
    , []
    )


usedInSignature : ( String, String, List Message )
usedInSignature =
    ( "usedInSignature"
    , """module Foo exposing (foo)

type alias Bar = Int
foo : Bar
foo = 1

"""
    , []
    )


usedAsFunction : ( String, String, List Message )
usedAsFunction =
    ( "usedAsFunction"
    , """module Foo exposing (foo)

type alias Person = { name : String, age : Int}

foo =
    Person "John" 12

"""
    , []
    )


unusedAlias : ( String, String, List Message )
unusedAlias =
    ( "unusedAlias"
    , """module Foo exposing (foo)

type alias Person = { name : String, age : Int}

foo = 1
"""
    , [ UnusedAlias "./foo" "Person" emptyRange ]
    )


all : Test
all =
    CTU.build "Analyser.Checks.UnusedAliasesTests"
        UnusedAliases.scan
        [ unusedButExposed
        , usedInSignature
        , usedAsFunction
        , unusedAlias
        ]
