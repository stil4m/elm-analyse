module Analyser.Checks.ImportAllTests exposing (..)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.ImportAll as ImportAll
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Range as Range
import Test exposing (..)


importAll : ( String, String, List MessageData )
importAll =
    ( "importAll"
    , """module Bar exposing (..)

import Foo exposing (..)

"""
    , [ Data.init "foo"
            |> Data.addModuleName "moduleName" [ "Foo" ]
            |> Data.addRange "range"
                (Range.manual
                    { start = { row = 2, column = 21 }, end = { row = 2, column = 23 } }
                    { start = { row = 2, column = 20 }, end = { row = 2, column = 22 } }
                )
      ]
    )


importAllMultiple : ( String, String, List MessageData )
importAllMultiple =
    ( "importAllMultiple"
    , """module Bar exposing (..)

import Foo exposing (..)
import Baz exposing (..)

"""
    , [ Data.init "foo"
            |> Data.addModuleName "moduleName" [ "Baz" ]
            |> Data.addRange "range"
                (Range.manual
                    { start = { row = 3, column = 21 }, end = { row = 3, column = 23 } }
                    { start = { row = 3, column = 20 }, end = { row = 3, column = 22 } }
                )
      , Data.init "foo"
            |> Data.addModuleName "moduleName" [ "Foo" ]
            |> Data.addRange "range"
                (Range.manual
                    { start = { row = 2, column = 21 }, end = { row = 2, column = 23 } }
                    { start = { row = 2, column = 20 }, end = { row = 2, column = 22 } }
                )
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
    CTU.build "Analyser.Checks.ImportAll"
        ImportAll.checker
        [ importAll
        , importAllMultiple
        , importStrict
        , importConstructorsStrict
        ]
