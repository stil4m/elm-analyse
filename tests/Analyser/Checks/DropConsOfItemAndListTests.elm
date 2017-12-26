module Analyser.Checks.DropConsOfItemAndListTests exposing (..)

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
                { start = { row = 4, column = 4 }, end = { row = 4, column = 16 } }
            |> Data.addRange "car"
                { start = { row = 4, column = 4 }, end = { row = 4, column = 5 } }
            |> Data.addRange "cdr"
                { start = { row = 4, column = 9 }, end = { row = 4, column = 16 } }
      ]
    )


all : Test
all =
    CTU.build "Analyser.Checks.DropConsOfItemAndList"
        DropConsOfItemAndList.checker
        [ noOptimisation
        , consWithLiteralList
        ]
