module Analyser.Checks.DropConcatOfListsTests exposing (all, concatMultiElementList, couldUseCons, noOptimisation)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.DropConcatOfLists as DropConcatOfLists
import Analyser.Messages.Data as Data exposing (MessageData)
import Test exposing (..)


couldUseCons : ( String, String, List MessageData )
couldUseCons =
    ( "couldUseCons"
    , """module Bar exposing (foo)

foo : Int
foo =
    [1] ++ [3, 4]
"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 5, column = 5 }, end = { row = 5, column = 18 } }
      ]
    )


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


concatMultiElementList : ( String, String, List MessageData )
concatMultiElementList =
    ( "concatMultiElementList"
    , """module Bar exposing (foo)

foo : Int
foo =
    [1, 2] ++ [3, 4]
"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 5, column = 5 }, end = { row = 5, column = 21 } }
      ]
    )



--


all : Test
all =
    CTU.build "Analyser.Checks.DropConcatOfLists"
        DropConcatOfLists.checker
        [ couldUseCons
        , noOptimisation
        , concatMultiElementList
        ]
