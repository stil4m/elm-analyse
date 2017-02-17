module Analyser.Fixes.UnusedImportedVariableTests exposing (all)

import Test exposing (Test, describe, test)
import Expect
import Parser.Parser as Parser
import Analyser.Fixes.UnusedImportedVariable as Fixer exposing (fixer)
import Analyser.Messages.Types exposing (MessageData(UnusedImportedVariable))


all : Test
all =
    describe "Analyser.Fixes.UnusedImportedVariable"
        [ test "test fix on one line" <|
            \() ->
                let
                    input =
                        """module Foo exposing (..)

import Bar exposing (bar, other)

foo = bar 1
"""

                    output =
                        """module Foo exposing (..)

import Bar exposing (bar)

foo = bar 1
"""
                in
                    case Parser.parse input of
                        Just x ->
                            fixer.fix [ ( "./foo.elm", input, x ) ]
                                (UnusedImportedVariable "./foo.elm"
                                    "other"
                                    { start = { row = 2, column = 25 }, end = { row = 2, column = 30 } }
                                )
                                |> Expect.equal (Ok [ ( "./foo.elm", output ) ])

                        Nothing ->
                            Expect.equal True False
        ]
