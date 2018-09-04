module Analyser.Checks.ImportAllTests exposing (all, importAll, importAllMultiple, importConstructorsStrict, importStrict)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.ImportAll as ImportAll
import Analyser.Messages.Data as Data exposing (MessageData)
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
                { start = { row = 3, column = 22 }, end = { row = 3, column = 24 } }
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
                { start = { row = 4, column = 22 }, end = { row = 4, column = 24 } }
      , Data.init "foo"
            |> Data.addModuleName "moduleName" [ "Foo" ]
            |> Data.addRange "range"
                { start = { row = 3, column = 22 }, end = { row = 3, column = 24 } }
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

import Foo exposing (Bar(..))
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
