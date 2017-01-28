module Parser.PatternTests exposing (..)

import Parser.CombineTestUtil exposing (..)
import Expect
import AST.Types as Types exposing (..)
import Test exposing (..)
import Parser.Patterns as Parser exposing (..)
import AST.Util exposing (rangeFromInts)


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
                    |> Expect.equal (Just (StringPattern "Foo"))
        , test "char pattern" <|
            \() ->
                parseFullStringState emptyState "'f'" Parser.pattern
                    |> Expect.equal (Just (CharPattern 'f'))
        , test "non cons pattern " <|
            \() ->
                parseFullStringState emptyState "(X x)" Parser.nonConsPattern
                    |> Expect.equal
                        (Just (TuplePattern ([ NamedPattern (QualifiedNameRef [] "X") ([ VarPattern { value = "x", range = { start = { row = 1, column = 3 }, end = { row = 1, column = 4 } } } ]) ])))
        , test "parentiszed pattern" <|
            \() ->
                parseFullStringState emptyState "(X x) :: xs" Parser.pattern
                    |> Expect.equal
                        (Just ((UnConsPattern (TuplePattern ([ NamedPattern (QualifiedNameRef [] "X") ([ VarPattern { value = "x", range = { start = { row = 1, column = 3 }, end = { row = 1, column = 4 } } } ]) ])) (VarPattern { value = "xs", range = { start = { row = 1, column = 9 }, end = { row = 1, column = 11 } } }))))
        , test "int pattern" <|
            \() ->
                parseFullStringState emptyState "1" Parser.pattern
                    |> Expect.equal (Just (IntPattern 1))
        , test "uncons pattern" <|
            \() ->
                parseFullStringState emptyState "n :: tail" Parser.pattern
                    |> Expect.equal (Just (UnConsPattern (VarPattern { value = "n", range = { start = { row = 1, column = 0 }, end = { row = 1, column = 1 } } }) (VarPattern { value = "tail", range = { start = { row = 1, column = 5 }, end = { row = 1, column = 9 } } })))
        , test "list pattern" <|
            \() ->
                parseFullStringState emptyState "[1]" Parser.pattern
                    |> Expect.equal (Just (ListPattern [ IntPattern 1 ]))
        , test "float pattern" <|
            \() ->
                parseFullStringState emptyState "1.2" Parser.pattern
                    |> Expect.equal (Just (FloatPattern 1.2))
        , test "record pattern" <|
            \() ->
                parseFullStringState emptyState "{a,b}" Parser.pattern
                    |> Expect.equal (Just (RecordPattern ([ { value = "a", range = { start = { row = 1, column = 1 }, end = { row = 1, column = 2 } } }, { value = "b", range = { start = { row = 1, column = 3 }, end = { row = 1, column = 4 } } } ])))
        , test "named pattern" <|
            \() ->
                parseFullStringState emptyState "True" Parser.namedPattern
                    |> Expect.equal (Just (NamedPattern (QualifiedNameRef [] "True") []))
        , test "tuple pattern" <|
            \() ->
                parseFullStringState emptyState "(a,{b,c},())" Parser.pattern
                    |> Expect.equal
                        (Just
                            (TuplePattern
                                [ VarPattern { value = "a", range = { start = { row = 1, column = 1 }, end = { row = 1, column = 2 } } }
                                , RecordPattern
                                    [ { value = "b", range = { start = { row = 1, column = 4 }, end = { row = 1, column = 5 } } }
                                    , { value = "c", range = { start = { row = 1, column = 6 }, end = { row = 1, column = 7 } } }
                                    ]
                                , UnitPattern
                                ]
                            )
                        )
        , test "destructure pattern" <|
            \() ->
                parseFullStringState emptyState "Set x" Parser.pattern
                    |> Expect.equal
                        (Just
                            (NamedPattern (QualifiedNameRef [] "Set")
                                [ VarPattern { value = "x", range = rangeFromInts ( 1, 4, 1, 5 ) } ]
                            )
                        )
        , test "tuple pattern 2" <|
            \() ->
                parseFullStringState emptyState "(model, cmd)" Parser.pattern
                    |> Expect.equal
                        (Just
                            (TuplePattern
                                [ VarPattern { value = "model", range = rangeFromInts ( 1, 1, 1, 6 ) }
                                , VarPattern { value = "cmd", range = rangeFromInts ( 1, 8, 1, 11 ) }
                                ]
                            )
                        )
        , test "record as pattern" <|
            \() ->
                parseFullStringState emptyState "{model,context} as appState" Parser.pattern
                    |> Expect.equal
                        (Just
                            (AsPattern
                                (RecordPattern
                                    [ { value = "model", range = rangeFromInts ( 1, 1, 1, 6 ) }
                                    , { value = "context", range = rangeFromInts ( 1, 7, 1, 14 ) }
                                    ]
                                )
                                { value = "appState", range = rangeFromInts ( 1, 19, 1, 27 ) }
                            )
                        )
        , test "complex pattern" <|
            \() ->
                parseFullStringState emptyState "(Index irec as index, docVector)" Parser.pattern
                    |> Expect.equal
                        (Just
                            (TuplePattern
                                ([ NamedPattern (QualifiedNameRef [] "Index")
                                    ([ AsPattern (VarPattern { value = "irec", range = rangeFromInts ( 1, 7, 1, 11 ) })
                                        { value = "index", range = rangeFromInts ( 1, 15, 1, 20 ) }
                                     ]
                                    )
                                 , VarPattern { value = "docVector", range = rangeFromInts ( 1, 22, 1, 31 ) }
                                 ]
                                )
                            )
                        )
        , test "complex pattern 2" <|
            \() ->
                parseFullStringState emptyState "RBNode_elm_builtin col (RBNode_elm_builtin Red  (RBNode_elm_builtin Red xv))" Parser.pattern
                    |> Expect.equal
                        (Just
                            (NamedPattern (QualifiedNameRef [] "RBNode_elm_builtin")
                                [ VarPattern { value = "col", range = rangeFromInts ( 1, 19, 1, 22 ) }
                                , TuplePattern
                                    [ NamedPattern (QualifiedNameRef [] "RBNode_elm_builtin")
                                        [ (QualifiedNamePattern (QualifiedNameRef [] "Red"))
                                        , TuplePattern
                                            [ NamedPattern (QualifiedNameRef [] "RBNode_elm_builtin")
                                                [ QualifiedNamePattern (QualifiedNameRef [] "Red")
                                                , VarPattern { value = "xv", range = rangeFromInts ( 1, 72, 1, 74 ) }
                                                ]
                                            ]
                                        ]
                                    ]
                                ]
                            )
                        )
        ]
