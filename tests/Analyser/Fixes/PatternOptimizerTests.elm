module Analyser.Fixes.PatternOptimizerTests exposing (all)

import AST.Ranges exposing (emptyRange)
import AST.Types exposing (..)
import Analyser.Fixes.PatternOptimizer exposing (optimize)
import Expect
import Test exposing (..)


all : Test
all =
    describe "Analyser.Fixes.PatternOptimizer"
        [ test "variable to underscore" <|
            \() ->
                let
                    targetRange =
                        { start = { row = 1, column = 1 }, end = { row = 1, column = 4 } }
                in
                    QualifiedNamePattern { moduleName = [], name = "foo" } targetRange
                        |> optimize targetRange
                        |> Expect.equal (AllPattern emptyRange)
        ]
