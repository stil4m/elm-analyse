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
                    |> Maybe.map (Tuple.second >> noRangeInnerExpression)
                    |> Expect.equal
                        (Just
                            (LambdaExpression
                                { args = [ UnitPattern ]
                                , expression = (emptyRanged <| FunctionOrValue "foo")
                                }
                            )
                        )
        , test "args lambda" <|
            \() ->
                parseFullStringState emptyState "\\a b -> a + b" Parser.expression
                    |> Maybe.map (Tuple.second >> noRangeInnerExpression)
                    |> Expect.equal
                        (Just
                            (LambdaExpression
                                { args =
                                    [ VarPattern
                                        { value = "a"
                                        , range = { start = { row = 1, column = 1 }, end = { row = 1, column = 2 } }
                                        }
                                    , VarPattern { value = "b", range = { start = { row = 1, column = 3 }, end = { row = 1, column = 4 } } }
                                    ]
                                , expression =
                                    emptyRanged <|
                                        Application
                                            ([ emptyRanged <| FunctionOrValue "a"
                                             , emptyRanged <| Operator "+"
                                             , emptyRanged <| FunctionOrValue "b"
                                             ]
                                            )
                                }
                            )
                        )
        , test "tuple lambda" <|
            \() ->
                parseFullStringState emptyState "\\(a,b) -> a + b" Parser.expression
                    |> Maybe.map (Tuple.second >> noRangeInnerExpression)
                    |> Expect.equal
                        (Just
                            (LambdaExpression
                                { args =
                                    [ TuplePattern
                                        ([ VarPattern
                                            { value = "a"
                                            , range =
                                                { start = { row = 1, column = 2 }
                                                , end = { row = 1, column = 3 }
                                                }
                                            }
                                         , VarPattern { value = "b", range = { start = { row = 1, column = 4 }, end = { row = 1, column = 5 } } }
                                         ]
                                        )
                                    ]
                                , expression = emptyRanged <| Application ([ emptyRanged <| FunctionOrValue "a", emptyRanged <| Operator "+", emptyRanged <| FunctionOrValue "b" ])
                                }
                            )
                        )
        ]
