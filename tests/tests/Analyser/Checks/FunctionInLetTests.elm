module Analyser.Checks.FunctionInLetTests exposing (all)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.FunctionInLet as FunctionInLet
import Analyser.Messages.Data as Data exposing (MessageData)
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
    , [ Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 5, column = 7 }, end = { row = 5, column = 8 } }
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
