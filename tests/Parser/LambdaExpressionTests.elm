module Parser.LambdaExpressionTests exposing (..)

import Parser.CombineTestUtil exposing (..)
import Expect
import Parser.Declarations as Parser exposing (..)
import AST.Types as Types exposing (..)
import AST.Util exposing (rangeFromInts)
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
                        (Just (LambdaExpression { args = [ VarPattern { value = "a", range = { start = { row = 1, column = 1 }, end = { row = 1, column = 2 } } }, VarPattern { value = "b", range = { start = { row = 1, column = 3 }, end = { row = 1, column = 4 } } } ], expression = Application ([ FunctionOrValue "a", Operator "+", FunctionOrValue "b" ]) }))
        , test "tuple lambda" <|
            \() ->
                parseFullStringState emptyState "\\(a,b) -> a + b" Parser.expression
                    |> Expect.equal
                        (Just (LambdaExpression { args = [ TuplePattern ([ VarPattern { value = "a", range = { start = { row = 1, column = 2 }, end = { row = 1, column = 3 } } }, VarPattern { value = "b", range = { start = { row = 1, column = 4 }, end = { row = 1, column = 5 } } } ]) ], expression = Application ([ FunctionOrValue "a", Operator "+", FunctionOrValue "b" ]) }))
        ]
