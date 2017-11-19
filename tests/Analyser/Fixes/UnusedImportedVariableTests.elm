module Analyser.Fixes.UnusedImportedVariableTests exposing (all)

import Analyser.Fixes.UnusedImportedVariable exposing (fixer)
import Analyser.Messages.Data as Data
import Analyser.Messages.Range as Range
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
                        fixer.fix ( input, x )
                            (Data.init "Foo"
                                |> Data.addVarName "varName" "other"
                                |> Data.addRange "range"
                                    (Range.manual
                                        { start = { row = 2, column = 26 }, end = { row = 2, column = 31 } }
                                        { start = { row = 2, column = 25 }, end = { row = 2, column = 30 } }
                                    )
                            )
                            |> Expect.equal (Ok output)

                    Err _ ->
                        Expect.equal True False
        ]
