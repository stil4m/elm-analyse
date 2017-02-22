module Parser.PatternTests exposing (..)

import Parser.CombineTestUtil exposing (..)
import Expect
import AST.Types exposing (..)
import AST.Ranges exposing (Range, Location, emptyRange)
import Test exposing (..)
import Parser.Patterns as Parser exposing (..)
import Parser.State exposing (emptyState)


all : Test
all =
    describe "PatternTests"
        [ test "all pattern" <|
            \() ->
                parseFullStringState emptyState "_" Parser.pattern
                    |> Expect.equal (Just (AllPattern (Range (Location 1 0) (Location 1 1))))
        , test "unit pattern" <|
            \() ->
                parseFullStringState emptyState "()" Parser.pattern
                    |> Expect.equal (Just (UnitPattern (Range (Location 1 0) (Location 1 2))))
        , test "string pattern" <|
            \() ->
                parseFullStringState emptyState "\"Foo\"" Parser.pattern
                    |> Expect.equal (Just (StringPattern "Foo" (Range (Location 1 0) (Location 1 5))))
        , test "char pattern" <|
            \() ->
                parseFullStringState emptyState "'f'" Parser.pattern
                    |> Expect.equal (Just (CharPattern 'f' (Range (Location 1 0) (Location 1 3))))
        , test "non cons pattern " <|
            \() ->
                parseFullStringState emptyState "(X x)" Parser.pattern
                    |> Expect.equal
                        (Just
                            (TuplePattern
                                [ NamedPattern (QualifiedNameRef [] "X")
                                    [ VarPattern "x" (Range (Location 1 3) (Location 1 4)) ]
                                    (Range (Location 1 1) (Location 1 4))
                                ]
                                (Range (Location 1 0) (Location 1 5))
                            )
                        )
        , test "uncons with parens pattern" <|
            \() ->
                parseFullStringState emptyState "(X x) :: xs" Parser.pattern
                    |> Expect.equal
                        (Just
                            ((UnConsPattern
                                (TuplePattern
                                    [ NamedPattern (QualifiedNameRef [] "X")
                                        [ VarPattern "x" (Range (Location 1 3) (Location 1 4)) ]
                                        (Range (Location 1 1) (Location 1 4))
                                    ]
                                    (Range (Location 1 0) (Location 1 5))
                                )
                                (VarPattern "xs" (Range (Location 1 9) (Location 1 11)))
                                (Range (Location 1 0) (Location 1 11))
                             )
                            )
                        )
        , test "int pattern" <|
            \() ->
                parseFullStringState emptyState "1" Parser.pattern
                    |> Expect.equal (Just (IntPattern 1 (Range (Location 1 0) (Location 1 1))))
        , test "uncons pattern" <|
            \() ->
                parseFullStringState emptyState "n :: tail" Parser.pattern
                    |> Expect.equal
                        (Just
                            (UnConsPattern (VarPattern "n" (Range (Location 1 0) (Location 1 1)))
                                (VarPattern "tail" (Range (Location 1 5) (Location 1 9)))
                                (Range (Location 1 0) (Location 1 9))
                            )
                        )
        , test "list pattern" <|
            \() ->
                parseFullStringState emptyState "[1]" Parser.pattern
                    |> Expect.equal
                        (Just
                            (ListPattern [ IntPattern 1 (Range (Location 1 1) (Location 1 2)) ]
                                (Range (Location 1 0) (Location 1 3))
                            )
                        )
        , test "float pattern" <|
            \() ->
                parseFullStringState emptyState "1.2" Parser.pattern
                    |> Expect.equal (Just (FloatPattern 1.2 (Range (Location 1 0) (Location 1 3))))
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
                    |> Expect.equal
                        (Just
                            (AsPattern
                                (RecordPattern
                                    [ { value = "model", range = (Range (Location 1 1) (Location 1 6)) }
                                    , { value = "context", range = (Range (Location 1 7) (Location 1 14)) }
                                    ]
                                    (Range (Location 1 0) (Location 1 15))
                                )
                                { value = "appState", range = (Range (Location 1 19) (Location 1 27)) }
                                (Range (Location 1 0) (Location 1 27))
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
