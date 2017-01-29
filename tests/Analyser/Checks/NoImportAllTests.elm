module Analyser.Checks.NoImportAllTests exposing (..)

import Analyser.Checks.NoImportAll as NoImportAll
import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Messages exposing (..)
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
    describe "Analyser.NoImportAllTests"
        [ test "importAll" <|
            \() ->
                CTU.getMessages importAll NoImportAll.scan
                    |> Expect.equal
                        (Just ([ ImportAll "./foo.elm" [ "Foo" ] { start = { row = 2, column = 20 }, end = { row = 2, column = 22 } } ]))
        , test "importAllMultiple" <|
            \() ->
                CTU.getMessages importAllMultiple NoImportAll.scan
                    |> Expect.equal
                        (Just
                            ([ ImportAll "./foo.elm" [ "Foo" ] { start = { row = 2, column = 20 }, end = { row = 2, column = 22 } }
                             , ImportAll "./foo.elm" [ "Baz" ] { start = { row = 3, column = 20 }, end = { row = 3, column = 22 } }
                             ]
                            )
                        )
        , test "importStrict" <|
            \() ->
                CTU.getMessages importStrict NoImportAll.scan
                    |> Expect.equal
                        (Just [])
        , test "importAllConstructors" <|
            \() ->
                CTU.getMessages importAllConstructors NoImportAll.scan
                    |> Expect.equal (Just ([ ImportAll "./foo.elm" [ "Foo" ] { start = { row = 2, column = 24 }, end = { row = 2, column = 26 } } ]))
        , test "importConstructorsStrict" <|
            \() ->
                CTU.getMessages importConstructorsStrict NoImportAll.scan
                    |> Expect.equal (Just [])
        ]
