module Parser.LambdaExpressionTests exposing (..)

import Parser.CombineTestUtil exposing (..)
import Expect
import Parser.Declarations as Parser exposing (..)
import Parser.Types as Types exposing (..)
import Test exposing (..)
import Parser.Patterns exposing (..)


all : Test
all =
    describe "LambdaExpressionTests"
        [ test "unit lambda" <|
            \() ->
                parseFullStringState emptyState "\\() -> foo" Parser.expression
                    |> Expect.equal
                        (Just
                            (Lambda
                                [ UnitPattern ]
                                (FunctionOrValue "foo")
                            )
                        )
        , test "args lambda" <|
            \() ->
                parseFullStringState emptyState "\\a b -> a + b" Parser.expression
                    |> Expect.equal
                        (Just
                            (Lambda
                                [ VarPattern "a", VarPattern "b" ]
                                (Application
                                    [ FunctionOrValue "a"
                                    , Operator "+"
                                    , FunctionOrValue "b"
                                    ]
                                )
                            )
                        )
        , test "tuple lambda" <|
            \() ->
                parseFullStringState emptyState "\\(a,b) -> a + b" Parser.expression
                    |> Expect.equal
                        (Just
                            (Lambda
                                [ TuplePattern [ VarPattern "a", VarPattern "b" ] ]
                                (Application
                                    [ FunctionOrValue "a"
                                    , Operator "+"
                                    , FunctionOrValue "b"
                                    ]
                                )
                            )
                        )
        ]
