module Analyser.Checks.DropConcatOfListsTests exposing (..)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.DropConcatOfLists as DropConcatOfLists
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Range as Range
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
                (Range.manual
                    { start = { row = 4, column = 4 }, end = { row = 4, column = 17 } }
                    { start = { row = 4, column = 3 }, end = { row = 5, column = -2 } }
                )
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
                (Range.manual
                    { start = { row = 4, column = 4 }, end = { row = 4, column = 20 } }
                    { start = { row = 4, column = 3 }, end = { row = 5, column = -2 } }
                )
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
