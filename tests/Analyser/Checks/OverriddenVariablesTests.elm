module Analyser.Checks.OverriddenVariablesTests exposing (..)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.OverriddenVariables as OverriddenVariables
import Analyser.Messages.Types exposing (MessageData(RedefineVariable))
import Test exposing (..)
import Analyser.Messages.Range as Range


redefineImportedFunction : ( String, String, List MessageData )
redefineImportedFunction =
    ( "redefineImportedFunction"
    , """module Bar exposing (foo)

import Bar exposing (bar)

foo bar = 1
  """
    , [ RedefineVariable "./foo.elm"
            "bar"
            (Range.manual
                { start = { row = 2, column = 21 }, end = { row = 2, column = 24 } }
                { start = { row = 2, column = 20 }, end = { row = 2, column = 23 } }
            )
            (Range.manual
                { start = { row = 4, column = 4 }, end = { row = 4, column = 7 } }
                { start = { row = 4, column = 3 }, end = { row = 4, column = 6 } }
            )
      ]
    )


redefineInLet : ( String, String, List MessageData )
redefineInLet =
    ( "redefineInLet"
    , """module Bar exposing (foo)

foo bar =
  let
    bar = 1
  in
    bar + 2

  """
    , [ RedefineVariable "./foo.elm"
            "bar"
            (Range.manual
                { start = { row = 2, column = 4 }, end = { row = 2, column = 7 } }
                { start = { row = 2, column = 3 }, end = { row = 2, column = 6 } }
            )
            (Range.manual
                { start = { row = 4, column = 4 }, end = { row = 4, column = 7 } }
                { start = { row = 4, column = 3 }, end = { row = 4, column = 6 } }
            )
      ]
    )


redefineInDestructuring : ( String, String, List MessageData )
redefineInDestructuring =
    ( "redefineInDestructuring"
    , """module Foo exposing (foo)

foo bar =
  case bar of
    X bar ->
      1
  """
    , [ RedefineVariable "./foo.elm"
            "bar"
            (Range.manual
                { start = { row = 2, column = 4 }, end = { row = 2, column = 7 } }
                { start = { row = 2, column = 3 }, end = { row = 2, column = 6 } }
            )
            (Range.manual
                { start = { row = 4, column = 6 }, end = { row = 4, column = 9 } }
                { start = { row = 4, column = 5 }, end = { row = 4, column = 8 } }
            )
      ]
    )


redefineImportAsFunction : ( String, String, List MessageData )
redefineImportAsFunction =
    ( "redefineImportAsFunction"
    , """module Foo exposing (foo)

import Bar exposing (bar)

bar = 1
  """
    , [ RedefineVariable "./foo.elm"
            "bar"
            (Range.manual
                { start = { row = 2, column = 21 }, end = { row = 2, column = 24 } }
                { start = { row = 2, column = 20 }, end = { row = 2, column = 23 } }
            )
            (Range.manual
                { start = { row = 4, column = 0 }, end = { row = 4, column = 3 } }
                { start = { row = 4, column = -1 }, end = { row = 4, column = 2 } }
            )
      ]
    )


redefineViaDestructuring : ( String, String, List MessageData )
redefineViaDestructuring =
    ( "redefineViaDestructuring"
    , """module Foo exposing (..)

import Bar exposing (name,age)

{age,name} = someThing
  """
    , [ RedefineVariable "./foo.elm"
            "age"
            (Range.manual
                { start = { row = 2, column = 26 }, end = { row = 2, column = 29 } }
                { start = { row = 2, column = 25 }, end = { row = 2, column = 28 } }
            )
            (Range.manual
                { start = { row = 4, column = 1 }, end = { row = 4, column = 4 } }
                { start = { row = 4, column = 0 }, end = { row = 4, column = 3 } }
            )
      , RedefineVariable "./foo.elm"
            "name"
            (Range.manual
                { start = { row = 2, column = 21 }, end = { row = 2, column = 25 } }
                { start = { row = 2, column = 20 }, end = { row = 2, column = 24 } }
            )
            (Range.manual
                { start = { row = 4, column = 5 }, end = { row = 4, column = 9 } }
                { start = { row = 4, column = 4 }, end = { row = 4, column = 8 } }
            )
      ]
    )


all : Test
all =
    CTU.build "Analyser.Checks.OverriddenVariablesTests"
        OverriddenVariables.checker
        [ redefineImportedFunction
        , redefineInLet
        , redefineInDestructuring
        , redefineImportAsFunction
        , redefineViaDestructuring
        ]
