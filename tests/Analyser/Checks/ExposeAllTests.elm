module Analyser.Checks.ExposeAllTests exposing (..)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.ExposeAll as ExposeAll
import Analyser.Messages.Data as Data exposing (MessageData)
import Test exposing (..)


exposingAll : ( String, String, List MessageData )
exposingAll =
    ( "exposingAll"
    , """module Bar exposing (..)

foo = 1
"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 0, column = 21 }, end = { row = 0, column = 23 } }
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
    CTU.build "Analyser.Checks.ExposeAll"
        ExposeAll.checker
        [ exposingAll
        , exposingStrict
        , exposingStrictConstructors
        ]
