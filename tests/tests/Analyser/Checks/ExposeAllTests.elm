module Analyser.Checks.ExposeAllTests exposing (all, exposingAll, exposingStrict, exposingStrictConstructors)

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
                { start = { row = 1, column = 22 }, end = { row = 1, column = 24 } }
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
    , """module Bar exposing (Color(..))

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
