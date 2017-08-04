module ASTUtil.PatternOptimizerTests exposing (all)

import AST.Ranges exposing (emptyRange)
import ASTUtil.PatternOptimizer exposing (optimize)
import Elm.Syntax.Base exposing (..)
import Elm.Syntax.Pattern exposing (..)
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
        , listPatternTests
        , tuplePatternTests
        , recordPatternTests
        , asPatternTests
        ]


asPatternTests : Test
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
                AsPattern
                    (VarPattern "x" targetRange)
                    (VariablePointer "y" otherRange)
                    otherRange
                    |> optimize targetRange
                    |> Expect.equal (VarPattern "y" otherRange)
        , test "should remove the as structure when the alias is unused" <|
            \() ->
                let
                    targetRange =
                        { start = { row = 1, column = 1 }, end = { row = 1, column = 4 } }

                    otherRange =
                        { start = { row = 2, column = 2 }, end = { row = 2, column = 4 } }
                in
                AsPattern
                    (VarPattern "x" otherRange)
                    (VariablePointer "y" targetRange)
                    otherRange
                    |> optimize targetRange
                    |> Expect.equal (VarPattern "x" otherRange)
        , test "should keep the as pattern when the sub pattern remains" <|
            \() ->
                let
                    targetRange =
                        { start = { row = 1, column = 1 }, end = { row = 1, column = 4 } }

                    otherRange =
                        { start = { row = 2, column = 2 }, end = { row = 2, column = 4 } }
                in
                AsPattern
                    (ListPattern
                        [ VarPattern "x" targetRange, VarPattern "y" otherRange ]
                        otherRange
                    )
                    (VariablePointer "z" otherRange)
                    otherRange
                    |> optimize targetRange
                    |> Expect.equal
                        (AsPattern
                            (ListPattern
                                [ AllPattern emptyRange, VarPattern "y" otherRange ]
                                otherRange
                            )
                            (VariablePointer "z" otherRange)
                            otherRange
                        )
        ]


recordPatternTests : Test
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
                RecordPattern
                    [ VariablePointer "x" targetRange
                    , VariablePointer "y" otherRange
                    ]
                    otherRange
                    |> optimize targetRange
                    |> Expect.equal (RecordPattern [ VariablePointer "y" otherRange ] otherRange)
        , test "should replace the record when no fields are left" <|
            \() ->
                let
                    targetRange =
                        { start = { row = 1, column = 1 }, end = { row = 1, column = 4 } }

                    otherRange =
                        { start = { row = 2, column = 2 }, end = { row = 2, column = 4 } }
                in
                RecordPattern
                    [ VariablePointer "x" targetRange
                    ]
                    otherRange
                    |> optimize targetRange
                    |> Expect.equal (AllPattern emptyRange)
        ]


listPatternTests : Test
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
                ListPattern
                    [ VarPattern "x" targetRange
                    , AllPattern otherRange
                    ]
                    otherRange
                    |> optimize targetRange
                    |> Expect.equal
                        (ListPattern
                            [ AllPattern emptyRange
                            , AllPattern otherRange
                            ]
                            otherRange
                        )
        , test "partially underscored list to underscore" <|
            \() ->
                let
                    targetRange =
                        { start = { row = 1, column = 1 }, end = { row = 1, column = 4 } }

                    otherRange =
                        { start = { row = 2, column = 2 }, end = { row = 2, column = 4 } }
                in
                ListPattern
                    [ VarPattern "x" targetRange
                    , VarPattern "y" otherRange
                    ]
                    otherRange
                    |> optimize targetRange
                    |> Expect.equal
                        (ListPattern
                            [ AllPattern emptyRange
                            , VarPattern "y" otherRange
                            ]
                            otherRange
                        )
        ]


tuplePatternTests : Test
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
                TuplePattern
                    [ VarPattern "x" targetRange
                    , AllPattern otherRange
                    ]
                    otherRange
                    |> optimize targetRange
                    |> Expect.equal (AllPattern emptyRange)
        , test "partially underscored tuple to underscore" <|
            \() ->
                let
                    targetRange =
                        { start = { row = 1, column = 1 }, end = { row = 1, column = 4 } }

                    otherRange =
                        { start = { row = 2, column = 2 }, end = { row = 2, column = 4 } }
                in
                TuplePattern
                    [ VarPattern "x" targetRange
                    , VarPattern "y" otherRange
                    ]
                    otherRange
                    |> optimize targetRange
                    |> Expect.equal
                        (TuplePattern
                            [ AllPattern emptyRange
                            , VarPattern "y" otherRange
                            ]
                            otherRange
                        )
        ]
