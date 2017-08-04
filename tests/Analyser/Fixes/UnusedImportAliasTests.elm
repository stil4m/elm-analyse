module Analyser.Fixes.UnusedImportAliasTests exposing (all)

import Analyser.Fixes.UnusedImportAlias as Fixer exposing (fixer)
import Analyser.Messages.Range as Range
import Analyser.Messages.Types exposing (MessageData(UnusedImportAlias))
import Elm.Parser as Parser
import Elm.Processing as Processing
import Expect
import Test exposing (Test, describe, test)


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
                case Parser.parse input |> Result.map (Processing.process Processing.init) of
                    Ok x ->
                        fixer.fix [ ( "./foo.elm", input, x ) ]
                            (UnusedImportAlias "./foo.elm"
                                [ "Bar" ]
                                (Range.manual
                                    { start = { row = 2, column = 0 }, end = { row = 2, column = 37 } }
                                    { start = { row = 2, column = -1 }, end = { row = 3, column = -2 } }
                                )
                            )
                            |> Expect.equal (Ok [ ( "./foo.elm", output ) ])

                    Err _ ->
                        Expect.equal True False
        ]
