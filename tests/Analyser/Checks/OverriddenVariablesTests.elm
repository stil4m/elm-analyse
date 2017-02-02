module Analyser.Checks.OverriddenVariablesTests exposing (..)

import AST.Ranges exposing (emptyRange)
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
    , [ RedefineVariable "./foo.elm" "bar" emptyRange emptyRange
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
    , [ RedefineVariable "./foo.elm" "bar" emptyRange emptyRange
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
    , [ RedefineVariable "./foo.elm" "bar" emptyRange emptyRange
      ]
    )


all : Test
all =
    CTU.build "Analyser.Checks.OverriddenVariablesTests"
        OverriddenVariables.scan
        [ redefineImportedFunction
        , redefineInLet
        , redefineInDestructuring
        ]
