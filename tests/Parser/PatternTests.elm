module Parser.PatternTests exposing (..)

import Parser.CombineTestUtil exposing (..)
import Expect
import AST.Types exposing (..)
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
                    |> Maybe.map noRangePattern
                    |> Expect.equal (Just (AllPattern emptyRange))
        , test "unit pattern" <|
            \() ->
                parseFullStringState emptyState "()" Parser.pattern
                    |> Maybe.map noRangePattern
                    |> Expect.equal (Just (UnitPattern emptyRange))
        , test "string pattern" <|
            \() ->
                parseFullStringState emptyState "\"Foo\"" Parser.pattern
                    |> Maybe.map noRangePattern
                    |> Expect.equal (Just (StringPattern "Foo" emptyRange))
        , test "char pattern" <|
            \() ->
                parseFullStringState emptyState "'f'" Parser.pattern
                    |> Maybe.map noRangePattern
                    |> Expect.equal (Just (CharPattern 'f' emptyRange))
        , test "non cons pattern " <|
            \() ->
                parseFullStringState emptyState "(X x)" Parser.pattern
                    |> Maybe.map noRangePattern
                    |> Expect.equal
                        (Just
                            (TuplePattern
                                [ NamedPattern (QualifiedNameRef [] "X")
                                    [ VarPattern "x" emptyRange ]
                                    emptyRange
                                ]
                                emptyRange
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
                                    [ NamedPattern (QualifiedNameRef [] "X")
                                        [ VarPattern "x" emptyRange ]
                                        emptyRange
                                    ]
                                    emptyRange
                                )
                                (VarPattern "xs" emptyRange)
                                emptyRange
                             )
                            )
                        )
        , test "int pattern" <|
            \() ->
                parseFullStringState emptyState "1" Parser.pattern
                    |> Maybe.map noRangePattern
                    |> Expect.equal (Just (IntPattern 1 emptyRange))
        , test "uncons pattern" <|
            \() ->
                parseFullStringState emptyState "n :: tail" Parser.pattern
                    |> Maybe.map noRangePattern
                    |> Expect.equal
                        (Just
                            (UnConsPattern (VarPattern "n" emptyRange)
                                (VarPattern "tail" emptyRange)
                                emptyRange
                            )
                        )
        , test "list pattern" <|
            \() ->
                parseFullStringState emptyState "[1]" Parser.pattern
                    |> Maybe.map noRangePattern
                    |> Expect.equal (Just (ListPattern [ IntPattern 1 emptyRange ] emptyRange))
        , test "float pattern" <|
            \() ->
                parseFullStringState emptyState "1.2" Parser.pattern
                    |> Maybe.map noRangePattern
                    |> Expect.equal (Just (FloatPattern 1.2 emptyRange))
        , test "record pattern" <|
            \() ->
                parseFullStringState emptyState "{a,b}" Parser.pattern
                    |> Maybe.map noRangePattern
                    |> Expect.equal
                        (Just
                            (RecordPattern
                                [ { value = "a", range = emptyRange }
                                , { value = "b", range = emptyRange }
                                ]
                                emptyRange
                            )
                        )
        , test "named pattern" <|
            \() ->
                parseFullStringState emptyState "True" Parser.pattern
                    |> Maybe.map noRangePattern
                    |> Expect.equal (Just (NamedPattern (QualifiedNameRef [] "True") [] emptyRange))
        , test "tuple pattern" <|
            \() ->
                parseFullStringState emptyState "(a,{b,c},())" Parser.pattern
                    |> Maybe.map noRangePattern
                    |> Expect.equal
                        (Just
                            (TuplePattern
                                [ VarPattern "a" emptyRange
                                , RecordPattern
                                    [ { value = "b", range = emptyRange }
                                    , { value = "c", range = emptyRange }
                                    ]
                                    emptyRange
                                , UnitPattern emptyRange
                                ]
                                emptyRange
                            )
                        )
        , test "destructure pattern" <|
            \() ->
                parseFullStringState emptyState "Set x" Parser.pattern
                    |> Maybe.map noRangePattern
                    |> Expect.equal
                        (Just
                            (NamedPattern (QualifiedNameRef [] "Set")
                                [ VarPattern "x" emptyRange ]
                                emptyRange
                            )
                        )
        , test "tuple pattern 2" <|
            \() ->
                parseFullStringState emptyState "(model, cmd)" Parser.pattern
                    |> Maybe.map noRangePattern
                    |> Expect.equal
                        (Just
                            (TuplePattern
                                [ VarPattern "model" emptyRange
                                , VarPattern "cmd" emptyRange
                                ]
                                emptyRange
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
                                    emptyRange
                                )
                                { value = "appState", range = emptyRange }
                                emptyRange
                            )
                        )
        , test "complex pattern" <|
            \() ->
                parseFullStringState emptyState "(Index irec as index, docVector)" Parser.pattern
                    |> Maybe.map noRangePattern
                    |> Expect.equal
                        (Just
                            (TuplePattern
                                [ NamedPattern (QualifiedNameRef [] "Index")
                                    [ AsPattern (VarPattern "irec" emptyRange)
                                        { value = "index", range = emptyRange }
                                        emptyRange
                                    ]
                                    emptyRange
                                , VarPattern "docVector" emptyRange
                                ]
                                emptyRange
                            )
                        )
        , test "complex pattern 2" <|
            \() ->
                parseFullStringState emptyState "RBNode_elm_builtin col (RBNode_elm_builtin Red  (RBNode_elm_builtin Red xv))" Parser.pattern
                    |> Maybe.map noRangePattern
                    |> Expect.equal
                        (Just
                            (NamedPattern (QualifiedNameRef [] "RBNode_elm_builtin")
                                [ VarPattern "col" emptyRange
                                , TuplePattern
                                    [ NamedPattern (QualifiedNameRef [] "RBNode_elm_builtin")
                                        [ (QualifiedNamePattern (QualifiedNameRef [] "Red") emptyRange)
                                        , TuplePattern
                                            [ NamedPattern (QualifiedNameRef [] "RBNode_elm_builtin")
                                                [ QualifiedNamePattern (QualifiedNameRef [] "Red") emptyRange
                                                , VarPattern "xv" emptyRange
                                                ]
                                                emptyRange
                                            ]
                                            emptyRange
                                        ]
                                        emptyRange
                                    ]
                                    emptyRange
                                ]
                                emptyRange
                            )
                        )
        ]
