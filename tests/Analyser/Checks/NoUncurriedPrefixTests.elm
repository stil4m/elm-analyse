module Analyser.Checks.NoUncurriedPrefixTests exposing (..)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.NoUncurriedPrefix as NoUncurriedPrefix
import Analyser.Messages.Types exposing (..)
import Test exposing (Test)
import Analyser.Messages.Range as Range


prefixAsApplicationWithTwoArgs : ( String, String, List MessageData )
prefixAsApplicationWithTwoArgs =
    ( "prefixAsApplicationWithTwoArgs"
    , """module Foo exposing (..)

foo = (+) 1 2
"""
    , [ NoUncurriedPrefix "./foo.elm" "+" <|
            Range.manual
                { start = { row = 2, column = 6 }, end = { row = 2, column = 9 } }
                { start = { row = 2, column = 5 }, end = { row = 2, column = 8 } }
      ]
    )


prefixAsApplicationWithOneArg : ( String, String, List MessageData )
prefixAsApplicationWithOneArg =
    ( "prefixAsApplicationWithOneArg"
    , """module Foo exposing (..)


foo = (+) 1

"""
    , []
    )


all : Test
all =
    CTU.build "Analyser.Checks.NoUncurriedPrefixTests"
        NoUncurriedPrefix.checker
        [ prefixAsApplicationWithTwoArgs
        , prefixAsApplicationWithOneArg
        ]
