module Analyser.Fixes.UnusedImportedVariableTests exposing (all)

import Test exposing (Test, describe, test)
import Expect
import Elm.Parser as Parser
import Analyser.Fixes.UnusedImportedVariable as Fixer exposing (fixer)
import Analyser.Messages.Types exposing (MessageData(UnusedImportedVariable))
import Elm.Processing as Processing


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
                    case Parser.parse input |> Result.map (Processing.process Processing.init) of
                        Ok x ->
                            fixer.fix [ ( "./foo.elm", input, x ) ]
                                (UnusedImportedVariable "./foo.elm"
                                    "other"
                                    { start = { row = 2, column = 25 }, end = { row = 2, column = 30 } }
                                )
                                |> Expect.equal (Ok [ ( "./foo.elm", output ) ])

                        Err _ ->
                            Expect.equal True False
        ]
