module Analyser.Fixes.UnusedImportedVariableTests exposing (all)

import Analyser.Checks.UnusedImportedVariable
import Analyser.Fixes.Base exposing (Patch(..))
import Analyser.Fixes.TestUtil exposing (testFix)
import Analyser.Fixes.UnusedImportedVariable exposing (fixer)
import Analyser.Messages.Data as Data
import Elm.Parser as Parser
import Elm.Processing as Processing
import Expect
import Test exposing (Test, describe, only, test)


fixOnOneLine =
    ( "fixOnOneLine"
    , """module Foo exposing (..)

import Bar exposing (bar, other)

foo = bar 1
"""
    , """module Foo exposing (..)

import Bar exposing (bar)

foo = bar 1
"""
    )


all : Test
all =
    testFix "Analyser.Fixes.UnnecessaryParens"
        Analyser.Checks.UnusedImportedVariable.checker
        Analyser.Fixes.UnusedImportedVariable.fixer
        [ fixOnOneLine
        ]



--
-- all : Test
-- all =
--     describe "Analyser.Fixes.UnusedImportedVariable"
--         [ test "test fix on one line" <|
--             \() ->
--                 let
--                     input =
--                         """module Foo exposing (..)
--
-- import Bar exposing (bar, other)
--
-- foo = bar 1
-- """
--
--                     output =
--                         """module Foo exposing (..)
--
-- import Bar exposing (bar)
--
-- foo = bar 1
-- """
--                 in
--                 case Parser.parse input |> Result.map (Processing.process Processing.init) of
--                     Ok x ->
--                         fixer.fix ( input, x )
--                             (Data.init "Foo"
--                                 |> Data.addVarName "varName" "other"
--                                 |> Data.addRange "range"
--                                     { start = { row = 2, column = 26 }, end = { row = 2, column = 31 } }
--                             )
--                             |> Expect.equal (Patched output)
--
--                     Err _ ->
--                         Expect.equal True False
--         ]
