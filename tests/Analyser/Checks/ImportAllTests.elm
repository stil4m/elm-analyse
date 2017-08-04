module Analyser.Checks.ImportAllTests exposing (..)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.ImportAll as ImportAll
import Analyser.Messages.Range as Range
import Analyser.Messages.Types exposing (..)
import Test exposing (..)


importAll : ( String, String, List MessageData )
importAll =
    ( "importAll"
    , """module Bar exposing (..)

import Foo exposing (..)

"""
    , [ ImportAll "./foo.elm" [ "Foo" ] <|
            Range.manual
                { start = { row = 2, column = 21 }, end = { row = 2, column = 23 } }
                { start = { row = 2, column = 20 }, end = { row = 2, column = 22 } }
      ]
    )


importAllMultiple : ( String, String, List MessageData )
importAllMultiple =
    ( "importAllMultiple"
    , """module Bar exposing (..)

import Foo exposing (..)
import Baz exposing (..)

"""
    , [ ImportAll "./foo.elm" [ "Foo" ] <|
            Range.manual
                { start = { row = 2, column = 21 }, end = { row = 2, column = 23 } }
                { start = { row = 2, column = 20 }, end = { row = 2, column = 22 } }
      , ImportAll "./foo.elm" [ "Baz" ] <|
            Range.manual
                { start = { row = 3, column = 21 }, end = { row = 3, column = 23 } }
                { start = { row = 3, column = 20 }, end = { row = 3, column = 22 } }
      ]
    )


importStrict : ( String, String, List MessageData )
importStrict =
    ( "importStrict"
    , """module Bar exposing (foo)

import Foo exposing (foo)
"""
    , []
    )


importAllConstructors : ( String, String, List MessageData )
importAllConstructors =
    ( "importAllConstructors"
    , """module Bar exposing (foo)

import Foo exposing (Bar(..))
"""
    , [ ImportAll "./foo.elm" [ "Foo" ] <|
            Range.manual
                { start = { row = 2, column = 25 }, end = { row = 2, column = 27 } }
                { start = { row = 2, column = 24 }, end = { row = 2, column = 26 } }
      ]
    )


importConstructorsStrict : ( String, String, List MessageData )
importConstructorsStrict =
    ( "importConstructorsStrict"
    , """module Bar exposing (foo)

import Foo exposing (Bar(Baz))
"""
    , []
    )


all : Test
all =
    CTU.build "Analyser.Checks.ImportAllTests"
        ImportAll.checker
        [ importAll
        , importAllMultiple
        , importStrict
        , importAllConstructors
        , importConstructorsStrict
        ]
