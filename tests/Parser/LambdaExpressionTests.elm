module Parser.LambdaExpressionTests exposing (..)

import Parser.CombineTestUtil exposing (..)
import Expect
import Parser.Declarations as Parser exposing (..)
import AST.Types as Types exposing (..)
import Test exposing (..)


all : Test
all =
    describe "LambdaExpressionTests"
        [ test "unit lambda" <|
            \() ->
                parseFullStringState emptyState "\\() -> foo" Parser.expression
                    |> Expect.equal
                        (Just
                            (LambdaExpression
                                { args = [ UnitPattern ]
                                , expression = (FunctionOrValue "foo")
                                }
                            )
                        )
        , test "args lambda" <|
            \() ->
                parseFullStringState emptyState "\\a b -> a + b" Parser.expression
                    |> Expect.equal
                        (Just
                            (LambdaExpression
                                { args = [ VarPattern "a", VarPattern "b" ]
                                , expression =
                                    (Application
                                        [ FunctionOrValue "a"
                                        , Operator "+"
                                        , FunctionOrValue "b"
                                        ]
                                    )
                                }
                            )
                        )
        , test "tuple lambda" <|
            \() ->
                parseFullStringState emptyState "\\(a,b) -> a + b" Parser.expression
                    |> Expect.equal
                        (Just
                            (LambdaExpression
                                { args = [ TuplePattern [ VarPattern "a", VarPattern "b" ] ]
                                , expression =
                                    (Application
                                        [ FunctionOrValue "a"
                                        , Operator "+"
                                        , FunctionOrValue "b"
                                        ]
                                    )
                                }
                            )
                        )
        ]
