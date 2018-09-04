module Analyser.Checks.UseConsOverConcatTests exposing (all)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.UseConsOverConcat as UseConsOverConcat
import Analyser.Messages.Data as Data exposing (MessageData)
import Test exposing (..)


noOptimisation : ( String, String, List MessageData )
noOptimisation =
    ( "noOptimisation"
    , """module Bar exposing (foo)

foo : Int
foo =
    [1, 2] ++ var
"""
    , []
    )


concatSingleItemToVar : ( String, String, List MessageData )
concatSingleItemToVar =
    ( "concatSingleItemToVar"
    , """module Bar exposing (foo)

foo : Int
foo =
    [1] ++ bar
"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 5, column = 5 }, end = { row = 5, column = 15 } }
      ]
    )


all : Test
all =
    CTU.build "Analyser.Checks.UseConsOverConcat"
        UseConsOverConcat.checker
        [ noOptimisation
        , concatSingleItemToVar
        ]
