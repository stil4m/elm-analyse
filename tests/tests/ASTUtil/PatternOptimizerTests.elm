module ASTUtil.PatternOptimizerTests exposing (all)

import AST.Ranges exposing (emptyRange)
import ASTUtil.PatternOptimizer exposing (optimize)
import Elm.Syntax.Node exposing (Node(..))
import Elm.Syntax.Pattern exposing (..)
import Expect
import Test exposing (..)


type alias InnerTest =
    Test


all : Test
all =
    describe "Analyser.Fixes.PatternOptimizer"
        [ test "variable to underscore" <|
            \() ->
                let
                    targetRange =
                        { start = { row = 1, column = 1 }, end = { row = 1, column = 4 } }
                in
                (Node targetRange <| NamedPattern { moduleName = [], name = "foo" } [])
                    |> optimize targetRange
                    |> Expect.equal (Node emptyRange <| AllPattern)
        , listPatternTests
        , tuplePatternTests
        , recordPatternTests
        , asPatternTests
        ]


asPatternTests : InnerTest
asPatternTests =
    describe "AsPattern"
        [ test "should remove the asPattern when the sub pattern is factored out" <|
            \() ->
                let
                    targetRange =
                        { start = { row = 1, column = 1 }, end = { row = 1, column = 4 } }

                    otherRange =
                        { start = { row = 2, column = 2 }, end = { row = 2, column = 4 } }
                in
                (Node otherRange <|
                    AsPattern
                        (Node targetRange <| VarPattern "x")
                        (Node otherRange "y")
                )
                    |> optimize targetRange
                    |> Expect.equal (Node otherRange <| VarPattern "y")
        , test "should remove the as structure when the alias is unused" <|
            \() ->
                let
                    targetRange =
                        { start = { row = 1, column = 1 }, end = { row = 1, column = 4 } }

                    otherRange =
                        { start = { row = 2, column = 2 }, end = { row = 2, column = 4 } }
                in
                (Node otherRange <|
                    AsPattern
                        (Node otherRange <| VarPattern "x")
                        (Node targetRange "y")
                )
                    |> optimize targetRange
                    |> Expect.equal (Node otherRange <| VarPattern "x")
        , test "should keep the as pattern when the sub pattern remains" <|
            \() ->
                let
                    targetRange =
                        { start = { row = 1, column = 1 }, end = { row = 1, column = 4 } }

                    otherRange =
                        { start = { row = 2, column = 2 }, end = { row = 2, column = 4 } }
                in
                (Node otherRange <|
                    AsPattern
                        (Node otherRange <|
                            ListPattern
                                [ Node targetRange <| VarPattern "x", Node otherRange <| VarPattern "y" ]
                        )
                        (Node otherRange "z")
                )
                    |> optimize targetRange
                    |> Expect.equal
                        (Node otherRange <|
                            AsPattern
                                (Node otherRange <|
                                    ListPattern
                                        [ Node emptyRange AllPattern
                                        , Node otherRange <| VarPattern "y"
                                        ]
                                )
                                (Node otherRange "z")
                        )
        ]


recordPatternTests : InnerTest
recordPatternTests =
    describe "RecordPattern"
        [ test "should remove variables that are unused" <|
            \() ->
                let
                    targetRange =
                        { start = { row = 1, column = 1 }, end = { row = 1, column = 4 } }

                    otherRange =
                        { start = { row = 2, column = 2 }, end = { row = 2, column = 4 } }
                in
                (Node otherRange <|
                    RecordPattern
                        [ Node targetRange "x"
                        , Node otherRange "y"
                        ]
                )
                    |> optimize targetRange
                    |> Expect.equal (Node otherRange <| RecordPattern [ Node otherRange "y" ])
        , test "should replace the record when no fields are left" <|
            \() ->
                let
                    targetRange =
                        { start = { row = 1, column = 1 }, end = { row = 1, column = 4 } }

                    otherRange =
                        { start = { row = 2, column = 2 }, end = { row = 2, column = 4 } }
                in
                (Node otherRange <|
                    RecordPattern
                        [ Node targetRange "x"
                        ]
                )
                    |> optimize targetRange
                    |> Expect.equal (Node emptyRange AllPattern)
        ]


listPatternTests : InnerTest
listPatternTests =
    describe "ListPattern"
        [ test "full underscored should not be changed to a list to underscore" <|
            \() ->
                let
                    targetRange =
                        { start = { row = 1, column = 1 }, end = { row = 1, column = 4 } }

                    otherRange =
                        { start = { row = 2, column = 2 }, end = { row = 2, column = 4 } }
                in
                (Node otherRange <|
                    ListPattern
                        [ Node targetRange <| VarPattern "x"
                        , Node otherRange AllPattern
                        ]
                )
                    |> optimize targetRange
                    |> Expect.equal
                        (Node otherRange <|
                            ListPattern
                                [ Node emptyRange AllPattern
                                , Node otherRange AllPattern
                                ]
                        )
        , test "partially underscored list to underscore" <|
            \() ->
                let
                    targetRange =
                        { start = { row = 1, column = 1 }, end = { row = 1, column = 4 } }

                    otherRange =
                        { start = { row = 2, column = 2 }, end = { row = 2, column = 4 } }
                in
                (Node otherRange <|
                    ListPattern
                        [ Node targetRange <| VarPattern "x"
                        , Node otherRange <| VarPattern "y"
                        ]
                )
                    |> optimize targetRange
                    |> Expect.equal
                        (Node otherRange <|
                            ListPattern
                                [ Node emptyRange AllPattern
                                , Node otherRange <| VarPattern "y"
                                ]
                        )
        ]


tuplePatternTests : InnerTest
tuplePatternTests =
    describe "TuplePattern"
        [ test "full underscored tuple to underscore" <|
            \() ->
                let
                    targetRange =
                        { start = { row = 1, column = 1 }, end = { row = 1, column = 4 } }

                    otherRange =
                        { start = { row = 2, column = 2 }, end = { row = 2, column = 4 } }
                in
                (Node otherRange <|
                    TuplePattern
                        [ Node targetRange <| VarPattern "x"
                        , Node otherRange AllPattern
                        ]
                )
                    |> optimize targetRange
                    |> Expect.equal (Node emptyRange AllPattern)
        , test "partially underscored tuple to underscore" <|
            \() ->
                let
                    targetRange =
                        { start = { row = 1, column = 1 }, end = { row = 1, column = 4 } }

                    otherRange =
                        { start = { row = 2, column = 2 }, end = { row = 2, column = 4 } }
                in
                (Node otherRange <|
                    TuplePattern
                        [ Node targetRange <| VarPattern "x"
                        , Node otherRange <| VarPattern "y"
                        ]
                )
                    |> optimize targetRange
                    |> Expect.equal
                        (Node otherRange <|
                            TuplePattern
                                [ Node emptyRange AllPattern
                                , Node otherRange <| VarPattern "y"
                                ]
                        )
        ]
