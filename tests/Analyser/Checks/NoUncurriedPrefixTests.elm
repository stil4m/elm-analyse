module Analyser.Checks.NoUncurriedPrefixTests exposing (..)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.NoUncurriedPrefix as NoUncurriedPrefix
import Analyser.Messages exposing (..)
import Test exposing (Test)


prefixAsApplicationWithTwoArgs : ( String, String, List Message )
prefixAsApplicationWithTwoArgs =
    ( "prefixAsApplicationWithTwoArgs"
    , """module Foo exposing (..)

foo = (+) 1 2
"""
    , [ NoUnurriedPrefix "./foo.elm" "+" { start = { row = 2, column = 5 }, end = { row = 2, column = 8 } }
      ]
    )


prefixAsApplicationWithOneArg : ( String, String, List Message )
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
        NoUncurriedPrefix.scan
        [ prefixAsApplicationWithTwoArgs
        , prefixAsApplicationWithOneArg
        ]
