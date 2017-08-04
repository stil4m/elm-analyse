module Analyser.Checks.ExposeAllTests exposing (..)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.ExposeAll as ExposeAll
import Analyser.Messages.Range as Range
import Analyser.Messages.Types exposing (..)
import Test exposing (..)


exposingAll : ( String, String, List MessageData )
exposingAll =
    ( "exposingAll"
    , """module Bar exposing (..)

foo = 1
"""
    , [ ExposeAll "./foo.elm" <|
            Range.manual
                { start = { row = 0, column = 21 }, end = { row = 0, column = 23 } }
                { start = { row = 1, column = 21 }, end = { row = 1, column = 23 } }
      ]
    )


exposingStrict : ( String, String, List MessageData )
exposingStrict =
    ( "exposingStrict"
    , """module Bar exposing (foo)

foo = 1
"""
    , []
    )


exposingAllConstructors : ( String, String, List MessageData )
exposingAllConstructors =
    ( "exposingAllConstructors"
    , """module Bar exposing (Color(..))

type Color = Blue | Red
"""
    , [ ExposeAll "./foo.elm" <|
            Range.manual
                { start = { row = 0, column = 27 }, end = { row = 0, column = 29 } }
                { start = { row = 1, column = 27 }, end = { row = 1, column = 29 } }
      ]
    )


exposingStrictConstructors : ( String, String, List MessageData )
exposingStrictConstructors =
    ( "exposingStrictConstructors"
    , """module Bar exposing (Color(Blue,Red))

type Color = Blue | Red
"""
    , []
    )


all : Test
all =
    CTU.build "Analyser.Checks.ExposeAllTests"
        ExposeAll.checker
        [ exposingAll
        , exposingStrict
        , exposingAllConstructors
        , exposingStrictConstructors
        ]
