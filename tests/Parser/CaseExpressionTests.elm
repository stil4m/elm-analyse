module Parser.CaseExpressionTests exposing (..)

import Parser.CombineTestUtil exposing (..)
import Expect
import Parser.Declarations as Parser exposing (..)
import AST.Types exposing (..)
import AST.Ranges exposing (emptyRange)
import Test exposing (..)
import Tuple2
import Parser.State exposing (emptyState)


all : Test
all =
    describe "Case expression tests"
        [ test "case block" <|
            \() ->
                parseFullStringState emptyState "case True of" Parser.caseBlock
                    |> Maybe.map (Tuple.second >> noRangeInnerExpression)
                    |> Expect.equal (Just (FunctionOrValue "True"))
        , test "case block with wrong indent" <|
            \() ->
                parseFullStringState emptyState "case\nTrue\nof" Parser.caseBlock
                    |> Expect.equal Nothing
        , test "caseStatement" <|
            \() ->
                parseFullStringState emptyState "True -> 1" Parser.caseStatement
                    |> Maybe.map (((Tuple2.mapSecond noRangeExpression >> Tuple2.mapFirst noRangePattern)))
                    |> Expect.equal
                        (Just
                            ( NamedPattern (QualifiedNameRef [] "True") [] emptyRange
                            , emptyRanged <| Integer 1
                            )
                        )
        , test "caseStatement qualified" <|
            \() ->
                parseFullStringState emptyState "Foo.Bar -> 1" Parser.caseStatement
                    |> Maybe.map (((Tuple2.mapSecond noRangeExpression >> Tuple2.mapFirst noRangePattern)))
                    |> Expect.equal
                        (Just
                            ( NamedPattern (QualifiedNameRef [ "Foo" ] "Bar") [] emptyRange
                            , emptyRanged <| Integer 1
                            )
                        )
        , test "caseStatement no spacing" <|
            \() ->
                parseFullStringState emptyState "32->Backspace" Parser.caseStatement
                    |> Maybe.map (((Tuple2.mapSecond noRangeExpression >> Tuple2.mapFirst noRangePattern)))
                    |> Expect.equal
                        (Just
                            ( IntPattern 32 emptyRange
                            , emptyRanged <| FunctionOrValue "Backspace"
                            )
                        )
        , test "caseStatement wrong indent" <|
            \() ->
                parseFullStringState emptyState "True -> \n1" Parser.caseStatement
                    |> Expect.equal Nothing
        , test "caseStatement correct on new line" <|
            \() ->
                parseFullStringState emptyState "True ->\n  1" Parser.caseStatement
                    |> Maybe.map (Tuple2.mapSecond noRangeExpression >> Tuple2.mapFirst noRangePattern)
                    |> Expect.equal
                        (Just
                            ( NamedPattern (QualifiedNameRef [] "True") [] emptyRange
                            , emptyRanged <| Integer 1
                            )
                        )
        , test "caseStatements" <|
            \() ->
                parseFullStringState emptyState "True -> 1\nFalse -> 2" Parser.caseStatements
                    |> Maybe.map (List.map (Tuple2.mapSecond noRangeExpression >> Tuple2.mapFirst noRangePattern))
                    |> Expect.equal
                        (Just
                            [ ( NamedPattern (QualifiedNameRef [] "True") [] emptyRange
                              , emptyRanged <| Integer 1
                              )
                            , ( NamedPattern (QualifiedNameRef [] "False") [] emptyRange
                              , emptyRanged <| Integer 2
                              )
                            ]
                        )
        , test "case expression" <|
            \() ->
                parseFullStringState emptyState "case f of\n  True -> 1\n  False -> 2" Parser.expression
                    |> Maybe.map (Tuple.second >> noRangeInnerExpression)
                    |> Expect.equal
                        (Just
                            (CaseExpression
                                { expression = emptyRanged <| FunctionOrValue "f"
                                , cases =
                                    [ ( NamedPattern (QualifiedNameRef [] "True") [] emptyRange
                                      , emptyRanged <| Integer 1
                                      )
                                    , ( NamedPattern (QualifiedNameRef [] "False") [] emptyRange
                                      , emptyRanged <| Integer 2
                                      )
                                    ]
                                }
                            )
                        )
        , test "case expression wrong - indent second case" <|
            \() ->
                parseFullStringState emptyState "case f of\n  True -> 1\n False -> 2" Parser.expression
                    |> Maybe.map (Tuple.second >> noRangeInnerExpression)
                    |> Expect.equal Nothing
        , test "update case expression" <|
            \() ->
                parseFullStringState emptyState "case msg of\n  Increment ->\n    model + 1\n  Decrement ->\n    model - 1" Parser.expression
                    |> Maybe.map (Tuple.second >> noRangeInnerExpression)
                    |> Expect.equal
                        (Just
                            (CaseExpression
                                { expression = emptyRanged <| FunctionOrValue "msg"
                                , cases =
                                    [ ( NamedPattern (QualifiedNameRef [] "Increment") [] emptyRange
                                      , emptyRanged <|
                                            Application
                                                [ emptyRanged <| FunctionOrValue "model"
                                                , emptyRanged <| Operator "+"
                                                , emptyRanged <| Integer 1
                                                ]
                                      )
                                    , ( NamedPattern (QualifiedNameRef [] "Decrement") [] emptyRange
                                      , emptyRanged <|
                                            Application
                                                [ emptyRanged <| FunctionOrValue "model"
                                                , emptyRanged <| Operator "-"
                                                , emptyRanged <| Integer 1
                                                ]
                                      )
                                    ]
                                }
                            )
                        )
        ]
