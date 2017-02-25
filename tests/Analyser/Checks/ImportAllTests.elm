module Analyser.Checks.ImportAllTests exposing (..)

import Analyser.Checks.ImportAll as ImportAll
import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Messages.Types exposing (..)
import Expect
import Test exposing (..)


importAll : String
importAll =
    """module Bar exposing (..)

import Foo exposing (..)

"""


importAllMultiple : String
importAllMultiple =
    """module Bar exposing (..)

import Foo exposing (..)
import Baz exposing (..)

"""


importStrict : String
importStrict =
    """module Bar exposing (foo)

import Foo exposing (foo)
"""


importAllConstructors : String
importAllConstructors =
    """module Bar exposing (foo)

import Foo exposing (Bar(..))
"""


importConstructorsStrict : String
importConstructorsStrict =
    """module Bar exposing (foo)

import Foo exposing (Bar(Baz))
"""


all : Test
all =
    describe "Analyser.ImportAllTests"
        [ test "importAll" <|
            \() ->
                CTU.getMessages importAll ImportAll.checker
                    |> Expect.equal
                        (Just [ ImportAll "./foo.elm" [ "Foo" ] { start = { row = 2, column = 20 }, end = { row = 2, column = 22 } } ])
        , test "importAllMultiple" <|
            \() ->
                CTU.getMessages importAllMultiple ImportAll.checker
                    |> Expect.equal
                        (Just
                            [ ImportAll "./foo.elm" [ "Foo" ] { start = { row = 2, column = 20 }, end = { row = 2, column = 22 } }
                            , ImportAll "./foo.elm" [ "Baz" ] { start = { row = 3, column = 20 }, end = { row = 3, column = 22 } }
                            ]
                        )
        , test "importStrict" <|
            \() ->
                CTU.getMessages importStrict ImportAll.checker
                    |> Expect.equal
                        (Just [])
        , test "importAllConstructors" <|
            \() ->
                CTU.getMessages importAllConstructors ImportAll.checker
                    |> Expect.equal (Just [ ImportAll "./foo.elm" [ "Foo" ] { start = { row = 2, column = 24 }, end = { row = 2, column = 26 } } ])
        , test "importConstructorsStrict" <|
            \() ->
                CTU.getMessages importConstructorsStrict ImportAll.checker
                    |> Expect.equal (Just [])
        ]
