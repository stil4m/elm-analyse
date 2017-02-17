module Analyser.Fixes.UnusedImportAliasTests exposing (all)

import Test exposing (Test, describe, test)
import Expect
import Parser.Parser as Parser
import Analyser.Fixes.UnusedImportAlias as Fixer exposing (fixer)
import Analyser.Messages.Types exposing (MessageData(UnusedImportAlias))


all : Test
all =
    describe "Analyser.Fixes.UnusedImportedVariable"
        [ test "test fix on one line" <|
            \() ->
                let
                    input =
                        """module Foo exposing (..)

import Bar as B exposing (bar, other)

foo = bar 1
"""

                    output =
                        """module Foo exposing (..)

import Bar exposing (bar, other)

foo = bar 1
"""
                in
                    case Parser.parse input of
                        Just x ->
                            fixer.fix [ ( "./foo.elm", input, x ) ]
                                (UnusedImportAlias "./foo.elm"
                                    [ "Bar" ]
                                    { start = { row = 2, column = -1 }, end = { row = 3, column = -2 } }
                                )
                                |> Expect.equal (Ok [ ( "./foo.elm", output ) ])

                        Nothing ->
                            Expect.equal True False
        ]
