module Analyser.Checks.NotExposeAllTests exposing (..)

import Analyser.Checks.NotExposeAll as NotExposeAll
import Expect
import Test exposing (..)
import Analyser.Messages exposing (..)
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
    describe "Analyser.NotExposeAllTests"
        [ test "exposingAll" <|
            \() ->
                CTU.getMessages exposingAll NotExposeAll.scan
                    |> Expect.equal
                        (Just [ (UnusedVariable "./foo.elm" "y" { start = { row = 2, column = 5 }, end = { row = 2, column = 6 } }) ])
        , test "exposingStrict" <|
            \() ->
                CTU.getMessages exposingStrict NotExposeAll.scan
                    |> Expect.equal
                        (Just [])
        , test "exposingAllConstructors" <|
            \() ->
                CTU.getMessages exposingAllConstructors NotExposeAll.scan
                    |> Expect.equal
                        (Just [ (UnusedVariable "./foo.elm" "y" { start = { row = 2, column = 5 }, end = { row = 2, column = 6 } }) ])
        , test "exposingStrictConstructors" <|
            \() ->
                CTU.getMessages exposingStrictConstructors NotExposeAll.scan
                    |> Expect.equal
                        (Just [])
        ]
