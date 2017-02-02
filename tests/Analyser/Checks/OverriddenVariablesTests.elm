module Analyser.Checks.OverriddenVariablesTests exposing (..)

import Analyser.Checks.CheckTestUtil as CTU exposing (getMessages)
import Analyser.Checks.OverriddenVariables as OverriddenVariables
import Analyser.Messages exposing (Message(RedefineVariable))
import Test exposing (..)


redefineImportedFunction : ( String, String, List Message )
redefineImportedFunction =
    ( "redefineImportedFunction"
    , """module Bar exposing (foo)

import Bar exposing (bar)

foo bar = 1
  """
    , [ RedefineVariable "./foo.elm"
            "bar"
            { start = { row = 2, column = 20 }, end = { row = 2, column = 23 } }
            { start = { row = 4, column = 3 }, end = { row = 4, column = 6 } }
      ]
    )


redefineInLet : ( String, String, List Message )
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
            { start = { row = 2, column = 3 }, end = { row = 2, column = 6 } }
            { start = { row = 4, column = 3 }, end = { row = 4, column = 6 } }
      ]
    )


redefineInDestructuring : ( String, String, List Message )
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
            { start = { row = 2, column = 3 }, end = { row = 2, column = 6 } }
            { start = { row = 4, column = 5 }, end = { row = 4, column = 8 } }
      ]
    )


redefineImportAsFunction : ( String, String, List Message )
redefineImportAsFunction =
    ( "redefineImportAsFunction"
    , """module Foo exposing (foo)

import Bar exposing (bar)

bar = 1
  """
    , [ RedefineVariable "./foo.elm"
            "bar"
            { start = { row = 2, column = 20 }, end = { row = 2, column = 23 } }
            { start = { row = 4, column = -1 }, end = { row = 4, column = 2 } }
      ]
    )


redefineViaDestructuring : ( String, String, List Message )
redefineViaDestructuring =
    ( "redefineViaDestructuring"
    , """module Foo exposing (..)

import Bar exposing (name,age)

{age,name} = someThing
  """
    , [ RedefineVariable "./foo.elm"
            "age"
            { start = { row = 2, column = 25 }, end = { row = 2, column = 28 } }
            { start = { row = 4, column = 0 }, end = { row = 4, column = 3 } }
      , RedefineVariable "./foo.elm"
            "name"
            { start = { row = 2, column = 20 }, end = { row = 2, column = 24 } }
            { start = { row = 4, column = 4 }, end = { row = 4, column = 8 } }
      ]
    )


all : Test
all =
    CTU.build "Analyser.Checks.OverriddenVariablesTests"
        OverriddenVariables.scan
        [ redefineImportedFunction
        , redefineInLet
        , redefineInDestructuring
        , redefineImportAsFunction
        , redefineViaDestructuring
        ]
