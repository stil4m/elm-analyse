module Analyser.Fixes.UnusedImportAliasTests exposing (all)

import Analyser.Fixes.Base exposing (Fixer, Patch(..))
import Analyser.Fixes.UnusedImportAlias exposing (fixer)
import Analyser.Messages.Data as Data
import Elm.Parser as Parser
import Elm.Processing as Processing
import Expect
import Test exposing (Test, describe, only, test)


all : Test
all =
    describe "Analyser.Fixes.UnusedImportAlias"
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
                        fixer.fix ( input, x )
                            (Data.init "Foo Bar"
                                |> Data.addModuleName "moduleName" [ "Bar" ]
                                |> Data.addRange "range"
                                    { start = { row = 2, column = 0 }, end = { row = 2, column = 37 } }
                            )
                            |> Expect.equal
                                (Patched output)

                    Err _ ->
                        Expect.equal True False
        ]
