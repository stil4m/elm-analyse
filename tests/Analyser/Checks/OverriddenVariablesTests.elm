module Analyser.Checks.OverriddenVariablesTests exposing (..)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.OverriddenVariables as OverriddenVariables
import Analyser.Messages.Data as Data exposing (MessageData)
import Test exposing (..)


redefineImportedFunction : ( String, String, List MessageData )
redefineImportedFunction =
    ( "redefineImportedFunction"
    , """module Bar exposing (foo)

import Bar exposing (bar)

foo bar = 1
  """
    , [ Data.init "foo"
            |> Data.addVarName "varName" "bar"
            |> Data.addRange "range1"
                { start = { row = 2, column = 21 }, end = { row = 2, column = 24 } }
            |> Data.addRange "range2"
                { start = { row = 4, column = 4 }, end = { row = 4, column = 7 } }
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
    , [ Data.init "foo"
            |> Data.addVarName "varName" "bar"
            |> Data.addRange "range1"
                { start = { row = 2, column = 4 }, end = { row = 2, column = 7 } }
            |> Data.addRange "range2"
                { start = { row = 4, column = 4 }, end = { row = 4, column = 7 } }
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
    , [ Data.init "foo"
            |> Data.addVarName "varName" "bar"
            |> Data.addRange "range1"
                { start = { row = 2, column = 4 }, end = { row = 2, column = 7 } }
            |> Data.addRange "range2"
                { start = { row = 4, column = 6 }, end = { row = 4, column = 9 } }
      ]
    )


redefineImportAsFunction : ( String, String, List MessageData )
redefineImportAsFunction =
    ( "redefineImportAsFunction"
    , """module Foo exposing (foo)

import Bar exposing (bar)

bar = 1
  """
    , [ Data.init "foo"
            |> Data.addVarName "varName" "bar"
            |> Data.addRange "range1"
                { start = { row = 2, column = 21 }, end = { row = 2, column = 24 } }
            |> Data.addRange "range2"
                { start = { row = 4, column = 0 }, end = { row = 4, column = 3 } }
      ]
    )


redefineViaDestructuring : ( String, String, List MessageData )
redefineViaDestructuring =
    ( "redefineViaDestructuring"
    , """module Foo exposing (..)

import Bar exposing (name,age)

{age,name} = someThing
  """
    , [ Data.init "foo"
            |> Data.addVarName "varName" "age"
            |> Data.addRange "range1"
                { start = { row = 2, column = 26 }, end = { row = 2, column = 29 } }
            |> Data.addRange "range2"
                { start = { row = 4, column = 1 }, end = { row = 4, column = 4 } }
      , Data.init "foo"
            |> Data.addVarName "varName" "name"
            |> Data.addRange "range1"
                { start = { row = 2, column = 21 }, end = { row = 2, column = 25 } }
            |> Data.addRange "range2"
                { start = { row = 4, column = 5 }, end = { row = 4, column = 9 } }
      ]
    )


all : Test
all =
    CTU.build "Analyser.Checks.OverriddenVariables"
        OverriddenVariables.checker
        [ redefineImportedFunction
        , redefineInLet
        , redefineInDestructuring
        , redefineImportAsFunction
        , redefineViaDestructuring
        ]
