module Analyser.Checks.FunctionsInLetTests exposing (all)

import Analyser.Checks.FunctionsInLet as FunctionsInLet
import Test exposing (Test)
import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Messages.Types exposing (Message, MessageData(FunctionInLet), newMessage)


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
    , [ FunctionInLet "./foo.elm" { start = { row = 4, column = 5 }, end = { row = 4, column = 6 } }
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
    CTU.build "Analyser.Checks.FunctionsInLet"
        FunctionsInLet.checker
        [ functionInLet
        , curriedValueInLet
        ]
