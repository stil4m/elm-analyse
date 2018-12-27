module Analyser.Checks.DropConsOfItemAndListTests exposing (all, consWithLiteralList, noOptimisation)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.DropConsOfItemAndList as DropConsOfItemAndList
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


consWithLiteralList : ( String, String, List MessageData )
consWithLiteralList =
    ( "consWithLiteralList"
    , """module Bar exposing (foo)

foo : Int
foo =
    1 :: [2 , 3]
"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 5, column = 5 }, end = { row = 5, column = 17 } }
            |> Data.addRange "head"
                { start = { row = 5, column = 5 }, end = { row = 5, column = 6 } }
            |> Data.addRange "tail"
                { start = { row = 5, column = 10 }, end = { row = 5, column = 17 } }
      ]
    )


all : Test
all =
    CTU.build "Analyser.Checks.DropConsOfItemAndList"
        DropConsOfItemAndList.checker
        [ noOptimisation
        , consWithLiteralList
        ]
