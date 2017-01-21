module LetExpressionTests exposing (..)

import CombineTestUtil exposing (..)
import Expect
import Parser.Declarations as Parser exposing (..)
import Parser.Types as Types exposing (..)
import Test exposing (..)


all : Test
all =
    describe "LetExpressionTests"
        [ test "let body" <|
            \() ->
                parseFullStringState (emptyState |> pushIndent 2) "foo = bar\n  \n  john = doe" Parser.letBody
                    |> Expect.equal
                        (Just
                            [ FuncDecl { documentation = Nothing, signature = Nothing, declaration = { operatorDefinition = False, name = "foo", arguments = [], expression = (FunctionOrValue "bar") } }
                            , FuncDecl { documentation = Nothing, signature = Nothing, declaration = { operatorDefinition = False, name = "john", arguments = [], expression = (FunctionOrValue "doe") } }
                            ]
                        )
        , test "let block" <|
            \() ->
                parseFullStringState emptyState "let\n  foo = bar\n  \n  john = doe" Parser.letBlock
                    |> Expect.equal
                        (Just
                            [ FuncDecl { documentation = Nothing, signature = Nothing, declaration = { operatorDefinition = False, name = "foo", arguments = [], expression = (FunctionOrValue "bar") } }
                            , FuncDecl { documentation = Nothing, signature = Nothing, declaration = { operatorDefinition = False, name = "john", arguments = [], expression = (FunctionOrValue "doe") } }
                            ]
                        )
        , test "in block" <|
            \() ->
                parseFullStringState emptyState "in\n  foo bar 1" Parser.inBlock
                    |> Expect.equal (Just (Application [ FunctionOrValue "foo", FunctionOrValue "bar", Integer 1 ]))
        , test "correct let with indent" <|
            \() ->
                parseFullStringState (emptyState |> pushIndent 1) "let\n  bar = 1\n in\n  bar" Parser.expression
                    |> Expect.equal
                        (Just
                            (LetBlock
                                [ FuncDecl
                                    { documentation = Nothing
                                    , signature = Nothing
                                    , declaration = { operatorDefinition = False, name = "bar", arguments = [], expression = Integer 1 }
                                    }
                                ]
                                (FunctionOrValue "bar")
                            )
                        )
        ]
