module Parser.PatternTests exposing (..)

import Parser.CombineTestUtil exposing (..)
import Expect
import AST.Types as Types exposing (..)
import AST.Ranges exposing (emptyRange)
import Test exposing (..)
import Parser.Patterns as Parser exposing (..)
import Parser.State exposing (emptyState)


all : Test
all =
    describe "PatternTests"
        [ test "all pattern" <|
            \() ->
                parseFullStringState emptyState "_" Parser.pattern
                    |> Expect.equal (Just AllPattern)
        , test "unit pattern" <|
            \() ->
                parseFullStringState emptyState "()" Parser.pattern
                    |> Expect.equal (Just UnitPattern)
        , test "string pattern" <|
            \() ->
                parseFullStringState emptyState "\"Foo\"" Parser.pattern
                    |> Maybe.map noRangePattern
                    |> Expect.equal (Just (StringPattern "Foo"))
        , test "char pattern" <|
            \() ->
                parseFullStringState emptyState "'f'" Parser.pattern
                    |> Maybe.map noRangePattern
                    |> Expect.equal (Just (CharPattern 'f'))
        , test "non cons pattern " <|
            \() ->
                parseFullStringState emptyState "(X x)" Parser.pattern
                    |> Maybe.map noRangePattern
                    |> Expect.equal
                        (Just
                            (TuplePattern
                                ([ NamedPattern (QualifiedNameRef [] "X" emptyRange)
                                    ([ VarPattern { value = "x", range = emptyRange } ])
                                 ]
                                )
                            )
                        )
        , test "parentiszed pattern" <|
            \() ->
                parseFullStringState emptyState "(X x) :: xs" Parser.pattern
                    |> Maybe.map noRangePattern
                    |> Expect.equal
                        (Just
                            ((UnConsPattern
                                (TuplePattern
                                    ([ NamedPattern (QualifiedNameRef [] "X" emptyRange)
                                        ([ VarPattern { value = "x", range = emptyRange } ])
                                     ]
                                    )
                                )
                                (VarPattern { value = "xs", range = emptyRange })
                             )
                            )
                        )
        , test "int pattern" <|
            \() ->
                parseFullStringState emptyState "1" Parser.pattern
                    |> Maybe.map noRangePattern
                    |> Expect.equal (Just (IntPattern 1))
        , test "uncons pattern" <|
            \() ->
                parseFullStringState emptyState "n :: tail" Parser.pattern
                    |> Maybe.map noRangePattern
                    |> Expect.equal
                        (Just
                            (UnConsPattern (VarPattern { value = "n", range = emptyRange })
                                (VarPattern { value = "tail", range = emptyRange })
                            )
                        )
        , test "list pattern" <|
            \() ->
                parseFullStringState emptyState "[1]" Parser.pattern
                    |> Maybe.map noRangePattern
                    |> Expect.equal (Just (ListPattern [ IntPattern 1 ]))
        , test "float pattern" <|
            \() ->
                parseFullStringState emptyState "1.2" Parser.pattern
                    |> Maybe.map noRangePattern
                    |> Expect.equal (Just (FloatPattern 1.2))
        , test "record pattern" <|
            \() ->
                parseFullStringState emptyState "{a,b}" Parser.pattern
                    |> Maybe.map noRangePattern
                    |> Expect.equal
                        (Just
                            (RecordPattern
                                ([ { value = "a", range = emptyRange }
                                 , { value = "b", range = emptyRange }
                                 ]
                                )
                            )
                        )
        , test "named pattern" <|
            \() ->
                parseFullStringState emptyState "True" Parser.pattern
                    |> Maybe.map noRangePattern
                    |> Expect.equal (Just (NamedPattern (QualifiedNameRef [] "True" emptyRange) []))
        , test "tuple pattern" <|
            \() ->
                parseFullStringState emptyState "(a,{b,c},())" Parser.pattern
                    |> Maybe.map noRangePattern
                    |> Expect.equal
                        (Just
                            (TuplePattern
                                [ VarPattern { value = "a", range = emptyRange }
                                , RecordPattern
                                    [ { value = "b", range = emptyRange }
                                    , { value = "c", range = emptyRange }
                                    ]
                                , UnitPattern
                                ]
                            )
                        )
        , test "destructure pattern" <|
            \() ->
                parseFullStringState emptyState "Set x" Parser.pattern
                    |> Maybe.map noRangePattern
                    |> Expect.equal
                        (Just
                            (NamedPattern (QualifiedNameRef [] "Set" emptyRange)
                                [ VarPattern { value = "x", range = emptyRange } ]
                            )
                        )
        , test "tuple pattern 2" <|
            \() ->
                parseFullStringState emptyState "(model, cmd)" Parser.pattern
                    |> Maybe.map noRangePattern
                    |> Expect.equal
                        (Just
                            (TuplePattern
                                [ VarPattern { value = "model", range = emptyRange }
                                , VarPattern { value = "cmd", range = emptyRange }
                                ]
                            )
                        )
        , test "record as pattern" <|
            \() ->
                parseFullStringState emptyState "{model,context} as appState" Parser.pattern
                    |> Maybe.map noRangePattern
                    |> Expect.equal
                        (Just
                            (AsPattern
                                (RecordPattern
                                    [ { value = "model", range = emptyRange }
                                    , { value = "context", range = emptyRange }
                                    ]
                                )
                                { value = "appState", range = emptyRange }
                            )
                        )
        , test "complex pattern" <|
            \() ->
                parseFullStringState emptyState "(Index irec as index, docVector)" Parser.pattern
                    |> Maybe.map noRangePattern
                    |> Expect.equal
                        (Just
                            (TuplePattern
                                ([ NamedPattern (QualifiedNameRef [] "Index" emptyRange)
                                    ([ AsPattern (VarPattern { value = "irec", range = emptyRange })
                                        { value = "index", range = emptyRange }
                                     ]
                                    )
                                 , VarPattern { value = "docVector", range = emptyRange }
                                 ]
                                )
                            )
                        )
        , test "complex pattern 2" <|
            \() ->
                parseFullStringState emptyState "RBNode_elm_builtin col (RBNode_elm_builtin Red  (RBNode_elm_builtin Red xv))" Parser.pattern
                    |> Maybe.map noRangePattern
                    |> Expect.equal
                        (Just
                            (NamedPattern (QualifiedNameRef [] "RBNode_elm_builtin" emptyRange)
                                [ VarPattern { value = "col", range = emptyRange }
                                , TuplePattern
                                    [ NamedPattern (QualifiedNameRef [] "RBNode_elm_builtin" emptyRange)
                                        [ (QualifiedNamePattern (QualifiedNameRef [] "Red" emptyRange))
                                        , TuplePattern
                                            [ NamedPattern (QualifiedNameRef [] "RBNode_elm_builtin" emptyRange)
                                                [ QualifiedNamePattern (QualifiedNameRef [] "Red" emptyRange)
                                                , VarPattern { value = "xv", range = emptyRange }
                                                ]
                                            ]
                                        ]
                                    ]
                                ]
                            )
                        )
        ]
