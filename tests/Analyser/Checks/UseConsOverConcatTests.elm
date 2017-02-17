module Analyser.Checks.UseConsOverConcatTests exposing (..)

import Analyser.Checks.UseConsOverConcat as UseConsOverConcat
import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Messages.Types exposing (..)
import Test exposing (..)


couldUseCons : ( String, String, List MessageData )
couldUseCons =
    ( "couldUseCons"
    , """module Bar exposing (foo)

foo : Int
foo =
    [1] ++ [3, 4]
"""
    , [ UseConsOverConcat "./foo.elm" { start = { row = 4, column = 6 }, end = { row = 6, column = -1 } }
      ]
    )


concatMultiElementList : ( String, String, List MessageData )
concatMultiElementList =
    ( "concatMultiElementList"
    , """module Bar exposing (foo)

foo : Int
foo =
    [1, 2] ++ [3, 4]
"""
    , []
    )


all : Test
all =
    CTU.build "Analyser.Checks.NoDebugTests"
        UseConsOverConcat.scan
        [ couldUseCons
        , concatMultiElementList
        ]
