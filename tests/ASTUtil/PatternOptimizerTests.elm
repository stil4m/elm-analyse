module ASTUtil.PatternOptimizerTests exposing (all)

import AST.Ranges exposing (emptyRange)
import ASTUtil.PatternOptimizer exposing (optimize)
import Elm.Syntax.Base exposing (..)
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
                ( targetRange, QualifiedNamePattern { moduleName = [], name = "foo" } )
                    |> optimize targetRange
                    |> Expect.equal ( emptyRange, AllPattern )
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
                ( otherRange
                , AsPattern
                    ( targetRange, VarPattern "x" )
                    (VariablePointer "y" otherRange)
                )
                    |> optimize targetRange
                    |> Expect.equal ( otherRange, VarPattern "y" )
        , test "should remove the as structure when the alias is unused" <|
            \() ->
                let
                    targetRange =
                        { start = { row = 1, column = 1 }, end = { row = 1, column = 4 } }

                    otherRange =
                        { start = { row = 2, column = 2 }, end = { row = 2, column = 4 } }
                in
                ( otherRange
                , AsPattern
                    ( otherRange, VarPattern "x" )
                    (VariablePointer "y" targetRange)
                )
                    |> optimize targetRange
                    |> Expect.equal ( otherRange, VarPattern "x" )
        , test "should keep the as pattern when the sub pattern remains" <|
            \() ->
                let
                    targetRange =
                        { start = { row = 1, column = 1 }, end = { row = 1, column = 4 } }

                    otherRange =
                        { start = { row = 2, column = 2 }, end = { row = 2, column = 4 } }
                in
                ( otherRange
                , AsPattern
                    ( otherRange
                    , ListPattern
                        [ ( targetRange, VarPattern "x" ), ( otherRange, VarPattern "y" ) ]
                    )
                    (VariablePointer "z" otherRange)
                )
                    |> optimize targetRange
                    |> Expect.equal
                        ( otherRange
                        , AsPattern
                            ( otherRange
                            , ListPattern [ ( emptyRange, AllPattern ), ( otherRange, VarPattern "y" ) ]
                            )
                            (VariablePointer "z" otherRange)
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
                ( otherRange
                , RecordPattern
                    [ VariablePointer "x" targetRange
                    , VariablePointer "y" otherRange
                    ]
                )
                    |> optimize targetRange
                    |> Expect.equal ( otherRange, RecordPattern [ VariablePointer "y" otherRange ] )
        , test "should replace the record when no fields are left" <|
            \() ->
                let
                    targetRange =
                        { start = { row = 1, column = 1 }, end = { row = 1, column = 4 } }

                    otherRange =
                        { start = { row = 2, column = 2 }, end = { row = 2, column = 4 } }
                in
                ( otherRange
                , RecordPattern
                    [ VariablePointer "x" targetRange
                    ]
                )
                    |> optimize targetRange
                    |> Expect.equal ( emptyRange, AllPattern )
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
                ( otherRange
                , ListPattern
                    [ ( targetRange, VarPattern "x" )
                    , ( otherRange, AllPattern )
                    ]
                )
                    |> optimize targetRange
                    |> Expect.equal
                        ( otherRange
                        , ListPattern
                            [ ( emptyRange, AllPattern )
                            , ( otherRange, AllPattern )
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
                ( otherRange
                , ListPattern
                    [ ( targetRange, VarPattern "x" )
                    , ( otherRange, VarPattern "y" )
                    ]
                )
                    |> optimize targetRange
                    |> Expect.equal
                        ( otherRange
                        , ListPattern
                            [ ( emptyRange, AllPattern )
                            , ( otherRange, VarPattern "y" )
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
                ( otherRange
                , TuplePattern
                    [ ( targetRange, VarPattern "x" )
                    , ( otherRange, AllPattern )
                    ]
                )
                    |> optimize targetRange
                    |> Expect.equal ( emptyRange, AllPattern )
        , test "partially underscored tuple to underscore" <|
            \() ->
                let
                    targetRange =
                        { start = { row = 1, column = 1 }, end = { row = 1, column = 4 } }

                    otherRange =
                        { start = { row = 2, column = 2 }, end = { row = 2, column = 4 } }
                in
                ( otherRange
                , TuplePattern
                    [ ( targetRange, VarPattern "x" )
                    , ( otherRange, VarPattern "y" )
                    ]
                )
                    |> optimize targetRange
                    |> Expect.equal
                        ( otherRange
                        , TuplePattern
                            [ ( emptyRange, AllPattern )
                            , ( otherRange, VarPattern "y" )
                            ]
                        )
        ]
