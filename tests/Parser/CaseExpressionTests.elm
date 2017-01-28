module Parser.CaseExpressionTests exposing (..)

import Parser.CombineTestUtil exposing (..)
import Expect
import Parser.Declarations as Parser exposing (..)
import AST.Types as Types exposing (..)
import Test exposing (..)


all : Test
all =
    describe "Case expression tests"
        [ test "case block" <|
            \() ->
                parseFullStringState emptyState "case True of" Parser.caseBlock
                    |> Expect.equal (Just (FunctionOrValue "True"))
        , test "case block with wrong indent" <|
            \() ->
                parseFullStringState emptyState "case\nTrue\nof" Parser.caseBlock
                    |> Expect.equal Nothing
        , test "caseStatement" <|
            \() ->
                parseFullStringState emptyState "True -> 1" Parser.caseStatement
                    |> Expect.equal (Just ( NamedPattern (QualifiedNameRef [] "True") [], Integer 1 ))
        , test "caseStatement qualified" <|
            \() ->
                parseFullStringState emptyState "Foo.Bar -> 1" Parser.caseStatement
                    |> Expect.equal (Just ( NamedPattern (QualifiedNameRef [ "Foo" ] "Bar") [], Integer 1 ))
        , test "caseStatement no spacing" <|
            \() ->
                parseFullStringState emptyState "32->Backspace" Parser.caseStatement
                    |> Expect.equal (Just ( IntPattern 32, FunctionOrValue "Backspace" ))
        , test "caseStatement wrong indent" <|
            \() ->
                parseFullStringState emptyState "True -> \n1" Parser.caseStatement
                    |> Expect.equal Nothing
        , test "caseStatement correct on new line" <|
            \() ->
                parseFullStringState emptyState "True ->\n  1" Parser.caseStatement
                    |> Expect.equal (Just ( NamedPattern (QualifiedNameRef [] "True") [], Integer 1 ))
        , test "caseStatements" <|
            \() ->
                parseFullStringState emptyState "True -> 1\nFalse -> 2" Parser.caseStatements
                    |> Expect.equal
                        (Just
                            [ ( NamedPattern (QualifiedNameRef [] "True") [], Integer 1 )
                            , ( NamedPattern (QualifiedNameRef [] "False") [], Integer 2 )
                            ]
                        )
        , test "case expression" <|
            \() ->
                parseFullStringState emptyState "case f of\n  True -> 1\n  False -> 2" Parser.expression
                    |> Expect.equal
                        (Just
                            (CaseExpression
                                { expression = (FunctionOrValue "f")
                                , cases =
                                    [ ( NamedPattern (QualifiedNameRef [] "True") [], Integer 1 )
                                    , ( NamedPattern (QualifiedNameRef [] "False") [], Integer 2 )
                                    ]
                                }
                            )
                        )
        , test "case expression wrong - indent second case" <|
            \() ->
                parseFullStringState emptyState "case f of\n  True -> 1\n False -> 2" Parser.expression
                    |> Expect.equal Nothing
        , test "update case expression" <|
            \() ->
                parseFullStringState emptyState "case msg of\n  Increment ->\n    model + 1\n  Decrement ->\n    model - 1" Parser.expression
                    |> Expect.equal
                        (Just
                            (CaseExpression
                                { expression = (FunctionOrValue "msg")
                                , cases =
                                    [ ( NamedPattern (QualifiedNameRef [] "Increment") [], Application [ FunctionOrValue "model", Operator "+", Integer 1 ] )
                                    , ( NamedPattern (QualifiedNameRef [] "Decrement") [], Application [ FunctionOrValue "model", Operator "-", Integer 1 ] )
                                    ]
                                }
                            )
                        )
        ]
