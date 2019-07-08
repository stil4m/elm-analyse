module Analyser.Fixes.NoUncurriedPrefixTests exposing (all)

import Analyser.Checks.NoUncurriedPrefix
import Analyser.Fixes.NoUncurriedPrefix
import Analyser.Fixes.TestUtil exposing (testFix)
import Test exposing (Test, only)


prefixAsApplicationWithTwoArgs : ( String, String, String )
prefixAsApplicationWithTwoArgs =
    ( "prefixAsApplicationWithTwoArgs"
    , """module Foo exposing (..)

foo = (+) 1 2
"""
    , """module Foo exposing (..)

foo = 1 + 2
"""
    )


twoTupleAsApplicationWithTwoArgs : ( String, String, String )
twoTupleAsApplicationWithTwoArgs =
    ( "twoTupleAsApplicationWithTwoArgs"
    , """module Foo exposing (..)

foo = (,) 1 2
"""
    , """module Foo exposing (..)

foo = (1, 2)
"""
    )


all : Test
all =
    testFix "Analyser.Fixes.NoUncurriedPrefix"
        Analyser.Checks.NoUncurriedPrefix.checker
        Analyser.Fixes.NoUncurriedPrefix.fixer
        [ prefixAsApplicationWithTwoArgs
        , twoTupleAsApplicationWithTwoArgs
        ]
