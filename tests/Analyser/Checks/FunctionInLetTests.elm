module Analyser.Checks.FunctionInLetTests exposing (all)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.FunctionInLet as FunctionInLet
import Analyser.Messages.Range as Range
import Analyser.Messages.Types exposing (Message, MessageData(FunctionInLet), newMessage)
import Test exposing (Test)


functionInLet : ( String, String, List MessageData )
functionInLet =
    ( "functionInLet"
    , """module Bar exposing (..)

foo x =
  let
      y z =
        z
  in
    y x
"""
    , [ FunctionInLet "./foo.elm" <|
            Range.manual
                { start = { row = 4, column = 6 }, end = { row = 4, column = 7 } }
                { start = { row = 4, column = 5 }, end = { row = 4, column = 6 } }
      ]
    )


curriedValueInLet : ( String, String, List MessageData )
curriedValueInLet =
    ( "curriedValueInLet"
    , """module Bar exposing (..)

foo x =
  let
      y = List.map ((+) 1)
  in
    y x
"""
    , []
    )


all : Test
all =
    CTU.build "Analyser.Checks.FunctionInLet"
        FunctionInLet.checker
        [ functionInLet
        , curriedValueInLet
        ]
