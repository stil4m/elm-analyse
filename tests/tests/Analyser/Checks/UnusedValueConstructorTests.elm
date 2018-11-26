module Analyser.Checks.UnusedValueConstructorTests exposing (all)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.UnusedValueConstructor as UnusedValueConstructor
import Analyser.Messages.Data as Data exposing (MessageData)
import Test exposing (Test)


unusedButExposed : ( String, String, List MessageData )
unusedButExposed =
    ( "unusedButExposed"
    , """module Foo exposing (Foo(..))

type Foo = Bar
"""
    , []
    )


unusedButExposedViaAny : ( String, String, List MessageData )
unusedButExposedViaAny =
    ( "unusedButExposedViaAny"
    , """module Foo exposing (Foo(..))

type Foo = Bar
"""
    , []
    )


usedAndNotExposed : ( String, String, List MessageData )
usedAndNotExposed =
    ( "usedAndNotExposed"
    , """module Foo exposing (foo)

type Foo = Bar Int

foo = Bar 1
"""
    , []
    )


unusedAndNotExposed : ( String, String, List MessageData )
unusedAndNotExposed =
    ( "unusedAndNotExposed"
    , """module Foo exposing (foo)

type Foo = Bar Int

foo (Bar i ) = i
"""
    , [ Data.init "foo"
            |> Data.addVarName "varName" "Bar"
            |> Data.addRange "range"
                { start = { row = 3, column = 12 }, end = { row = 3, column = 19 } }
      ]
    )


all : Test
all =
    CTU.build "Analyser.Checks.UnusedValueConstructor"
        UnusedValueConstructor.checker
        [ unusedButExposed
        , unusedButExposedViaAny
        , usedAndNotExposed
        , unusedAndNotExposed
        ]
