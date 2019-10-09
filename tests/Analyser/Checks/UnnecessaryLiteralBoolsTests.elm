module Analyser.Checks.UnnecessaryLiteralBoolsTests exposing (all)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.UnnecessaryLiteralBools as UnnecessaryLiteralBools
import Analyser.Messages.Data as Data exposing (MessageData)
import Test exposing (Test, only)


redundantBoolean : ( String, String, List MessageData )
redundantBoolean =
    ( "redundantBoolean"
    , """module Bar exposing (..)

foo x =
    if condition then
        True

    else
        False

"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 4, column = 5 }, end = { row = 9, column = 1 } }
      ]
    )


all : Test
all =
    CTU.build "Analyser.Checks.UnnecessaryLiteralBools"
        UnnecessaryLiteralBools.checker
        [ redundantBoolean
        ]
