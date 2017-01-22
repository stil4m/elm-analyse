module CaseExpressionTests exposing (..)

import CombineTestUtil exposing (..)
import Expect
import Parser.Declarations as Parser exposing (..)
import Parser.Types as Types exposing (..)
import Test exposing (..)
import Parser.Patterns exposing (..)


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
                    |> Expect.equal (Just ( NamedPattern [] "True" [], Integer 1 ))
        , test "caseStatement qualified" <|
            \() ->
                parseFullStringState emptyState "Foo.Bar -> 1" Parser.caseStatement
                    |> Expect.equal (Just ( NamedPattern [ "Foo" ] "Bar" [], Integer 1 ))
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
                    |> Expect.equal (Just ( NamedPattern [] "True" [], Integer 1 ))
        , test "caseStatements" <|
            \() ->
                parseFullStringState emptyState "True -> 1\nFalse -> 2" Parser.caseStatements
                    |> Expect.equal
                        (Just
                            [ ( NamedPattern [] "True" [], Integer 1 )
                            , ( NamedPattern [] "False" [], Integer 2 )
                            ]
                        )
        , test "case expression" <|
            \() ->
                parseFullStringState emptyState "case f of\n  True -> 1\n  False -> 2" Parser.expression
                    |> Expect.equal
                        (Just
                            (CaseBlock (FunctionOrValue "f")
                                [ ( NamedPattern [] "True" [], Integer 1 )
                                , ( NamedPattern [] "False" [], Integer 2 )
                                ]
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
                            (CaseBlock (FunctionOrValue "msg")
                                [ ( NamedPattern [] "Increment" [], Application [ FunctionOrValue "model", Operator "+", Integer 1 ] )
                                , ( NamedPattern [] "Decrement" [], Application [ FunctionOrValue "model", Operator "-", Integer 1 ] )
                                ]
                            )
                        )
        ]
