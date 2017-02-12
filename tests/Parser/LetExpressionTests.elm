module Parser.LetExpressionTests exposing (..)

import Combine exposing ((*>), string, whitespace)
import Parser.CombineTestUtil exposing (..)
import Expect
import Parser.Declarations as Parser exposing (..)
import Parser.Tokens exposing (functionName)
import AST.Types as Types exposing (..)
import Test exposing (..)
import AST.Ranges exposing (emptyRange)
import Parser.State exposing (emptyState, pushIndent)


all : Test
all =
    describe "LetExpressionTests"
        [ test "let body" <|
            \() ->
                parseFullStringState (emptyState |> pushIndent 2) "foo = bar\n  \n  john = doe" Parser.letBody
                    |> Maybe.map (List.map noRangeDeclaration)
                    |> Expect.equal
                        (Just
                            [ FuncDecl
                                { documentation = Nothing
                                , signature = Nothing
                                , declaration =
                                    { operatorDefinition = False
                                    , name = { value = "foo", range = emptyRange }
                                    , arguments = []
                                    , expression = emptyRanged <| FunctionOrValue "bar"
                                    }
                                }
                            , FuncDecl
                                { documentation = Nothing
                                , signature = Nothing
                                , declaration =
                                    { operatorDefinition = False
                                    , name = { value = "john", range = emptyRange }
                                    , arguments = []
                                    , expression = emptyRanged <| FunctionOrValue "doe"
                                    }
                                }
                            ]
                        )
        , test "let block" <|
            \() ->
                parseFullStringState emptyState "let\n  foo = bar\n  \n  john = doe\n in" Parser.letBlock
                    |> Maybe.map (List.map noRangeDeclaration)
                    |> Expect.equal
                        (Just
                            ([ FuncDecl
                                { documentation = Nothing
                                , signature = Nothing
                                , declaration =
                                    { operatorDefinition = False
                                    , name = { value = "foo", range = emptyRange }
                                    , arguments = []
                                    , expression = emptyRanged <| FunctionOrValue "bar"
                                    }
                                }
                             , FuncDecl
                                { documentation = Nothing
                                , signature = Nothing
                                , declaration =
                                    { operatorDefinition = False
                                    , name = { value = "john", range = emptyRange }
                                    , arguments = []
                                    , expression = emptyRanged <| FunctionOrValue "doe"
                                    }
                                }
                             ]
                            )
                        )
        , test "correct let with indent" <|
            \() ->
                parseFullStringState (emptyState |> pushIndent 1) "let\n  bar = 1\n in\n  bar" Parser.expression
                    |> Maybe.map noRangeExpression
                    |> Maybe.map Tuple.second
                    |> Expect.equal
                        (Just
                            (LetExpression
                                { declarations =
                                    [ FuncDecl
                                        { documentation = Nothing
                                        , signature = Nothing
                                        , declaration =
                                            { operatorDefinition = False
                                            , name =
                                                { value = "bar"
                                                , range = emptyRange
                                                }
                                            , arguments = []
                                            , expression = emptyRanged <| Integer 1
                                            }
                                        }
                                    ]
                                , expression = emptyRanged <| FunctionOrValue "bar"
                                }
                            )
                        )
        , test "let with deindented expression in in" <|
            \() ->
                parseFullStringState emptyState "let\n  bar = 1\n in\n   bar" Parser.expression
                    |> Maybe.map noRangeExpression
                    |> Maybe.map Tuple.second
                    |> Expect.equal
                        (Just
                            (LetExpression
                                { declarations =
                                    [ FuncDecl
                                        { documentation = Nothing
                                        , signature = Nothing
                                        , declaration =
                                            { operatorDefinition = False
                                            , name = { value = "bar", range = emptyRange }
                                            , arguments = []
                                            , expression = emptyRanged <| Integer 1
                                            }
                                        }
                                    ]
                                , expression = emptyRanged <| FunctionOrValue "bar"
                                }
                            )
                        )
        , test "let in list" <|
            \() ->
                parseFullStringState emptyState "[\n  let\n    bar = 1\n  in\n    bar\n ]" Parser.expression
                    |> Maybe.map noRangeExpression
                    |> Maybe.map Tuple.second
                    |> Expect.equal
                        (Just
                            (ListExpr
                                ([ emptyRanged <|
                                    LetExpression
                                        { declarations =
                                            [ FuncDecl
                                                { documentation = Nothing
                                                , signature = Nothing
                                                , declaration =
                                                    { operatorDefinition = False
                                                    , name = { value = "bar", range = emptyRange }
                                                    , arguments = []
                                                    , expression = emptyRanged <| Integer 1
                                                    }
                                                }
                                            ]
                                        , expression = emptyRanged <| FunctionOrValue "bar"
                                        }
                                 ]
                                )
                            )
                        )
        , test "some let" <|
            \() ->
                parseFullStringState emptyState "let\n    _ = b\n in\n    z" (Parser.expression)
                    |> Maybe.map noRangeExpression
                    |> Maybe.map Tuple.second
                    |> Expect.equal
                        (Just
                            (LetExpression
                                { declarations =
                                    ([ DestructuringDeclaration { pattern = AllPattern, expression = (emptyRanged <| FunctionOrValue "b") }
                                     ]
                                    )
                                , expression = (emptyRanged <| FunctionOrValue "z")
                                }
                            )
                        )
        , test "let inlined" <|
            \() ->
                parseFullStringState emptyState "let indent = String.length s in indent" (Parser.expression)
                    |> Maybe.map noRangeExpression
                    |> Maybe.map Tuple.second
                    |> Expect.equal
                        (Just
                            (LetExpression
                                { declarations =
                                    [ FuncDecl
                                        { documentation = Nothing
                                        , signature = Nothing
                                        , declaration =
                                            { operatorDefinition = False
                                            , name = { value = "indent", range = emptyRange }
                                            , arguments = []
                                            , expression =
                                                emptyRanged <|
                                                    Application ([ emptyRanged <| QualifiedExpr [ "String" ] "length", emptyRanged <| FunctionOrValue "s" ])
                                            }
                                        }
                                    ]
                                , expression = emptyRanged <| FunctionOrValue "indent"
                                }
                            )
                        )
        , test "let starting after definition" <|
            \() ->
                parseFullStringState emptyState "foo = let\n  indent = 1\n in\n indent" (functionName *> string " = " *> Parser.expression)
                    |> Maybe.map noRangeExpression
                    |> Maybe.map Tuple.second
                    |> Expect.equal
                        (Just
                            (LetExpression
                                { declarations =
                                    [ FuncDecl
                                        { documentation = Nothing
                                        , signature =
                                            Nothing
                                        , declaration =
                                            { operatorDefinition = False
                                            , name =
                                                { value = "indent"
                                                , range = emptyRange
                                                }
                                            , arguments = []
                                            , expression = emptyRanged <| Integer 1
                                            }
                                        }
                                    ]
                                , expression = emptyRanged <| FunctionOrValue "indent"
                                }
                            )
                        )
        ]
