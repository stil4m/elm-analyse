module Parser.ExpressionTests exposing (..)

import Combine exposing ((*>), whitespace)
import Parser.CombineTestUtil exposing (..)
import Expect
import Parser.Declarations exposing (..)
import AST.Types exposing (..)
import AST.Ranges exposing (..)
import Test exposing (..)


all : Test
all =
    describe "ExpressionTests"
        [ test "empty" <|
            \() ->
                parseFullStringWithNullState "" expression
                    |> Expect.equal Nothing
        , test "String literal" <|
            \() ->
                parseFullStringWithNullState "\"Bar\"" expression
                    |> Maybe.map Tuple.second
                    |> Expect.equal (Just (Literal "Bar"))
        , test "character literal" <|
            \() ->
                parseFullStringWithNullState "'c'" expression
                    |> Maybe.map Tuple.second
                    |> Expect.equal (Just (CharLiteral 'c'))
        , test "tuple expression" <|
            \() ->
                parseFullStringWithNullState "(1,2)" expression
                    |> Maybe.map noRangeExpression
                    |> Maybe.map Tuple.second
                    |> Expect.equal (Just (TupledExpression [ emptyRanged <| Integer 1, emptyRanged <| Integer 2 ]))
        , test "prefix expression" <|
            \() ->
                parseFullStringWithNullState "(,)" expression
                    |> Maybe.map Tuple.second
                    |> Expect.equal (Just (PrefixOperator ","))
        , test "String literal multiline" <|
            \() ->
                parseFullStringWithNullState "\"\"\"Bar foo \n a\"\"\"" expression
                    |> Maybe.map Tuple.second
                    |> Expect.equal (Just (Literal "Bar foo \n a"))
        , test "Type expression" <|
            \() ->
                parseFullStringWithNullState "Bar" expression
                    |> Maybe.map Tuple.second
                    |> Expect.equal (Just (FunctionOrValue "Bar"))
        , test "Type expression" <|
            \() ->
                parseFullStringWithNullState "bar" expression
                    |> Maybe.map Tuple.second
                    |> Expect.equal (Just (FunctionOrValue "bar"))
        , test "operator" <|
            \() ->
                parseFullStringWithNullState "++" expression
                    |> Maybe.map Tuple.second
                    |> Expect.equal (Just (Operator "++"))
        , test "parenthesizedExpression" <|
            \() ->
                parseFullStringWithNullState "(bar)" expression
                    |> Maybe.map noRangeExpression
                    |> Maybe.map Tuple.second
                    |> Expect.equal
                        (Just
                            (ParenthesizedExpression
                                (emptyRanged <| FunctionOrValue "bar")
                            )
                        )
        , test "expressionNotApplication simple" <|
            \() ->
                parseFullStringWithNullState "foo" expression
                    |> Maybe.map noRangeExpression
                    |> Maybe.map Tuple.second
                    |> Expect.equal (Just (FunctionOrValue "foo"))
        , test "unit application" <|
            \() ->
                parseFullStringWithNullState "Task.succeed ()" expression
                    |> Maybe.map noRangeExpression
                    |> Maybe.map Tuple.second
                    |> Expect.equal
                        (Just
                            (Application
                                [ emptyRanged <|
                                    QualifiedExpr [ "Task" ] "succeed"
                                , emptyRanged <| UnitExpr
                                ]
                            )
                        )
        , test "compoundExpression" <|
            \() ->
                parseFullStringWithNullState "foo bar" expression
                    |> Maybe.map noRangeExpression
                    |> Maybe.map Tuple.second
                    |> Expect.equal
                        (Just
                            (Application
                                [ emptyRanged <| FunctionOrValue "foo"
                                , emptyRanged <| FunctionOrValue "bar"
                                ]
                            )
                        )
        , test "compoundExpression 2" <|
            \() ->
                parseFullStringWithNullState "{ key = value } ! []" expression
                    |> Maybe.map noRangeExpression
                    |> Maybe.map Tuple.second
                    |> Expect.equal
                        (Just
                            (Application
                                [ emptyRanged <| RecordExpr [ ( "key", emptyRanged <| FunctionOrValue "value" ) ]
                                , emptyRanged <| Operator "!"
                                , emptyRanged <| ListExpr []
                                ]
                            )
                        )
        , test "ifBlockExpression" <|
            \() ->
                parseFullStringWithNullState "if True then foo else bar" expression
                    |> Maybe.map noRangeExpression
                    |> Maybe.map Tuple.second
                    |> Expect.equal
                        (Just
                            (IfBlock
                                (emptyRanged <| FunctionOrValue "True")
                                (emptyRanged <| FunctionOrValue "foo")
                                (emptyRanged <| FunctionOrValue "bar")
                            )
                        )
        , test "nestedIfExpression" <|
            \() ->
                parseFullStringWithNullState "if True then if False then foo else baz else bar" expression
                    |> Maybe.map noRangeExpression
                    |> Maybe.map Tuple.second
                    |> Expect.equal
                        (Just
                            (IfBlock
                                (emptyRanged <| FunctionOrValue "True")
                                (emptyRanged <|
                                    IfBlock
                                        (emptyRanged <| FunctionOrValue "False")
                                        (emptyRanged <| FunctionOrValue "foo")
                                        (emptyRanged <| FunctionOrValue "baz")
                                )
                                (emptyRanged <| FunctionOrValue "bar")
                            )
                        )
        , test "recordExpression" <|
            \() ->
                parseFullStringWithNullState "{ model = 0, view = view, update = update }" expression
                    |> Maybe.map noRangeExpression
                    |> Maybe.map Tuple.second
                    |> Expect.equal
                        (Just
                            (RecordExpr
                                [ ( "model", emptyRanged <| Integer 0 )
                                , ( "view", emptyRanged <| FunctionOrValue "view" )
                                , ( "update", emptyRanged <| FunctionOrValue "update" )
                                ]
                            )
                        )
        , test "recordExpression with comment" <|
            \() ->
                parseFullStringWithNullState "{ foo = 1 -- bar\n , baz = 2 }" expression
                    |> Maybe.map noRangeExpression
                    |> Maybe.map Tuple.second
                    |> Expect.equal
                        (Just
                            (RecordExpr
                                [ ( "foo", emptyRanged <| Integer 1 )
                                , ( "baz", emptyRanged <| Integer 2 )
                                ]
                            )
                        )
        , test "listExpression" <|
            \() ->
                parseFullStringWithNullState "[ class \"a\", text \"Foo\"]" expression
                    |> Maybe.map noRangeExpression
                    |> Maybe.map Tuple.second
                    |> Expect.equal
                        (Just
                            (ListExpr
                                [ emptyRanged <| Application [ emptyRanged <| FunctionOrValue "class", emptyRanged <| Literal "a" ]
                                , emptyRanged <| Application [ emptyRanged <| FunctionOrValue "text", emptyRanged <| Literal "Foo" ]
                                ]
                            )
                        )
        , test "listExpression empty" <|
            \() ->
                parseFullStringWithNullState "[\n]" expression
                    |> Maybe.map Tuple.second
                    |> Expect.equal (Just (ListExpr []))
        , test "listExpression on indent" <|
            \() ->
                parseFullStringWithNullState "  [\n]" (whitespace *> expression)
                    |> Maybe.map Tuple.second
                    |> Expect.equal (Just (ListExpr []))
        , test "qualified expression" <|
            \() ->
                parseFullStringWithNullState "Html.text" expression
                    |> Maybe.map Tuple.second
                    |> Expect.equal
                        (Just
                            (QualifiedExpr [ "Html" ]
                                "text"
                            )
                        )
        , test "record access" <|
            \() ->
                parseFullStringWithNullState "foo.bar" expression
                    |> Maybe.map noRangeExpression
                    |> Maybe.map Tuple.second
                    |> Expect.equal (Just (RecordAccess ( emptyRange, FunctionOrValue "foo" ) "bar"))
        , test "record access multiple" <|
            \() ->
                parseFullStringWithNullState "foo.bar.baz" expression
                    |> Maybe.map noRangeExpression
                    |> Maybe.map Tuple.second
                    |> Expect.equal
                        (Just
                            (RecordAccess
                                ( emptyRange
                                , RecordAccess
                                    ( emptyRange
                                    , FunctionOrValue "foo"
                                    )
                                    "bar"
                                )
                                "baz"
                            )
                        )
        , test "record update" <|
            \() ->
                parseFullStringWithNullState "{ model | count = 1, loading = True }" expression
                    |> Maybe.map noRangeExpression
                    |> Maybe.map Tuple.second
                    |> Expect.equal
                        (Just
                            (RecordUpdateExpression
                                { name = "model"
                                , updates =
                                    [ ( "count", emptyRanged <| Integer 1 )
                                    , ( "loading", emptyRanged <| FunctionOrValue "True" )
                                    ]
                                }
                            )
                        )
        , test "record update no spacing" <|
            \() ->
                parseFullStringWithNullState "{model| count = 1, loading = True }" expression
                    |> Maybe.map noRangeExpression
                    |> Maybe.map Tuple.second
                    |> Expect.equal
                        (Just
                            (RecordUpdateExpression
                                { name = "model"
                                , updates =
                                    [ ( "count", emptyRanged <| Integer 1 )
                                    , ( "loading", emptyRanged <| FunctionOrValue "True" )
                                    ]
                                }
                            )
                        )
        , test "record access as function" <|
            \() ->
                parseFullStringWithNullState "List.map .name people" expression
                    |> Maybe.map noRangeExpression
                    |> Maybe.map Tuple.second
                    |> Expect.equal
                        (Just
                            (Application
                                [ emptyRanged <| QualifiedExpr [ "List" ] "map"
                                , emptyRanged <| RecordAccessFunction ".name"
                                , emptyRanged <| FunctionOrValue "people"
                                ]
                            )
                        )
        , test "prefix notation" <|
            \() ->
                parseFullStringWithNullState "(::) x" expression
                    |> Maybe.map noRangeExpression
                    |> Maybe.map Tuple.second
                    |> Expect.equal
                        (Just <|
                            Application
                                [ emptyRanged <| PrefixOperator "::"
                                , emptyRanged <| FunctionOrValue "x"
                                ]
                        )
        ]
