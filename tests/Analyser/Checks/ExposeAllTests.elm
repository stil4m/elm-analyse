module Analyser.Checks.ExposeAllTests exposing (..)

import Analyser.Checks.ExposeAll as ExposeAll
import Expect
import Test exposing (..)
import Analyser.Messages.Types exposing (..)
import Analyser.Checks.CheckTestUtil as CTU


exposingAll : String
exposingAll =
    """module Bar exposing (..)

foo = 1
"""


exposingStrict : String
exposingStrict =
    """module Bar exposing (foo)

foo = 1
"""


exposingAllConstructors : String
exposingAllConstructors =
    """module Bar exposing (Color(..))

type Color = Blue | Red
"""


exposingStrictConstructors : String
exposingStrictConstructors =
    """module Bar exposing (Color(Blue,Red))

type Color = Blue | Red
"""


all : Test
all =
    describe "Analyser.ExposeAllTests"
        [ test "exposingAll" <|
            \() ->
                CTU.getMessages exposingAll ExposeAll.checker
                    |> Expect.equal
                        (Just [ (ExposeAll "./foo.elm" { start = { row = 1, column = 21 }, end = { row = 1, column = 23 } }) ])
        , test "exposingStrict" <|
            \() ->
                CTU.getMessages exposingStrict ExposeAll.checker
                    |> Expect.equal
                        (Just [])
        , test "exposingAllConstructors" <|
            \() ->
                CTU.getMessages exposingAllConstructors ExposeAll.checker
                    |> Expect.equal
                        (Just [ (ExposeAll "./foo.elm" { start = { row = 1, column = 27 }, end = { row = 1, column = 29 } }) ])
        , test "exposingStrictConstructors" <|
            \() ->
                CTU.getMessages exposingStrictConstructors ExposeAll.checker
                    |> Expect.equal
                        (Just [])
        ]
