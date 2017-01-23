module LetExpressionTests exposing (..)

import Combine exposing ((*>), string, whitespace)
import CombineTestUtil exposing (..)
import Expect
import Parser.Declarations as Parser exposing (..)
import Parser.Tokens exposing (functionName)
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
                parseFullStringState emptyState "let\n  foo = bar\n  \n  john = doe\n in" Parser.letBlock
                    |> Expect.equal
                        (Just
                            [ FuncDecl { documentation = Nothing, signature = Nothing, declaration = { operatorDefinition = False, name = "foo", arguments = [], expression = (FunctionOrValue "bar") } }
                            , FuncDecl { documentation = Nothing, signature = Nothing, declaration = { operatorDefinition = False, name = "john", arguments = [], expression = (FunctionOrValue "doe") } }
                            ]
                        )
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
        , test "let with deindented expression in in" <|
            \() ->
                parseFullStringState emptyState "let\n  bar = 1\n in\n   bar" Parser.expression
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
        , test "let in list" <|
            \() ->
                parseFullStringState emptyState "[\n  let\n    bar = 1\n  in\n    bar\n ]" Parser.listExpression
                    |> Expect.equal
                        (Just
                            (ListExpr
                                [ LetBlock
                                    [ FuncDecl
                                        { documentation = Nothing
                                        , signature = Nothing
                                        , declaration =
                                            { operatorDefinition = False
                                            , name = "bar"
                                            , arguments = []
                                            , expression = Integer 1
                                            }
                                        }
                                    ]
                                    (FunctionOrValue "bar")
                                ]
                            )
                        )
        , test "some let" <|
            \() ->
                parseFullStringState emptyState "let\n    _ = b\n in\n    z" (Parser.letExpression)
                    |> Expect.equal
                        (Just
                            (LetBlock
                                ([ Destructuring AllPattern (FunctionOrValue "b")
                                 ]
                                )
                                (FunctionOrValue "z")
                            )
                        )
        , test "let inlined" <|
            \() ->
                parseFullStringState emptyState "let indent = String.length s in indent" (Parser.letExpression)
                    |> Expect.equal
                        (Just
                            (LetBlock
                                ([ FuncDecl
                                    { documentation = Nothing
                                    , signature = Nothing
                                    , declaration =
                                        { operatorDefinition = False
                                        , name = "indent"
                                        , arguments = []
                                        , expression = Application ([ QualifiedExpr ([ "String" ]) "length", FunctionOrValue "s" ])
                                        }
                                    }
                                 ]
                                )
                                (FunctionOrValue "indent")
                            )
                        )
        , test "let starting after definition" <|
            \() ->
                parseFullStringState emptyState "foo = let\n  indent = 1\n in\n indent" (functionName *> string " = " *> Parser.letExpression)
                    |> Expect.equal
                        (Just
                            (LetBlock
                                ([ FuncDecl
                                    { documentation = Nothing
                                    , signature = Nothing
                                    , declaration =
                                        { operatorDefinition = False
                                        , name = "indent"
                                        , arguments = []
                                        , expression = Integer 1
                                        }
                                    }
                                 ]
                                )
                                (FunctionOrValue "indent")
                            )
                        )
        ]
