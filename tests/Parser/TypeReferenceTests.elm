module Parser.TypeReferenceTests exposing (..)

import Parser.TypeReference as Parser
import AST.Types exposing (..)
import Test exposing (..)
import Expect
import Parser.CombineTestUtil exposing (..)
import AST.Ranges exposing (emptyRange)


all : Test
all =
    describe "TypeReferenceTests"
        [ test "unitTypeReference" <|
            \() ->
                parseFullStringWithNullState "()" Parser.typeReference
                    |> Maybe.map noRangeTypeReference
                    |> Expect.equal (Just <| Unit emptyRange)
        , test "unitTypeReference with spaces" <|
            \() ->
                parseFullStringWithNullState "( )" Parser.typeReference
                    |> Maybe.map noRangeTypeReference
                    |> Expect.equal (Just <| Unit emptyRange)
        , test "tupledTypeReference" <|
            \() ->
                parseFullStringWithNullState "( (), ())" Parser.typeReference
                    |> Maybe.map noRangeTypeReference
                    |> Expect.equal (Just <| Tupled [ Unit emptyRange, Unit emptyRange ] emptyRange)
        , test "tupledTypeReference 2" <|
            \() ->
                parseFullStringWithNullState "( () )" Parser.typeReference
                    |> Maybe.map noRangeTypeReference
                    |> Expect.equal (Just <| Unit emptyRange)
        , test "tupledTypeReference 3" <|
            \() ->
                parseFullStringWithNullState "( Int , Maybe m )" Parser.typeReference
                    |> Maybe.map noRangeTypeReference
                    |> Expect.equal
                        (Just
                            (Tupled
                                [ Typed [] "Int" [] emptyRange
                                , Typed [] "Maybe" [ Generic "m" ] emptyRange
                                ]
                                emptyRange
                            )
                        )
        , test "qualified type reference" <|
            \() ->
                parseFullStringWithNullState "Foo.Bar" Parser.typeReference
                    |> Maybe.map noRangeTypeReference
                    |> Expect.equal (Just (Typed [ "Foo" ] "Bar" [] emptyRange))
        , test "typeReferenceNoFn" <|
            \() ->
                parseFullStringWithNullState "Bar" Parser.typeReference
                    |> Maybe.map noRangeTypeReference
                    |> Expect.equal (Just (Typed [] "Bar" [] emptyRange))
        , test "typedTypeReference 1" <|
            \() ->
                parseFullStringWithNullState "Foo () a Bar" Parser.typeReference
                    |> Maybe.map noRangeTypeReference
                    |> Expect.equal
                        (Just <|
                            Typed []
                                "Foo"
                                [ Concrete <| Unit emptyRange
                                , Generic "a"
                                , Concrete (Typed [] "Bar" [] emptyRange)
                                ]
                                emptyRange
                        )
        , test "typedTypeReference 2" <|
            \() ->
                parseFullStringWithNullState "Foo () a Bar" Parser.typeReference
                    |> Maybe.map noRangeTypeReference
                    |> Expect.equal
                        (Just <|
                            Typed []
                                "Foo"
                                [ Concrete <| Unit emptyRange
                                , Generic "a"
                                , Concrete (Typed [] "Bar" [] emptyRange)
                                ]
                                emptyRange
                        )
        , test "recordTypeReference empty" <|
            \() ->
                parseFullStringWithNullState "{}" Parser.typeReference
                    |> Maybe.map noRangeTypeReference
                    |> Expect.equal
                        (Just <|
                            Record [] emptyRange
                        )
        , test "recordTypeReference one field" <|
            \() ->
                parseFullStringWithNullState "{color: String }" Parser.typeReference
                    |> Maybe.map noRangeTypeReference
                    |> Expect.equal
                        (Just <|
                            Record [ ( "color", Typed [] "String" [] emptyRange ) ] emptyRange
                        )
        , test "recordTypeReference nested record" <|
            \() ->
                parseFullStringWithNullState "{color: {r : Int, g :Int, b: Int } }" Parser.typeReference
                    |> Maybe.map noRangeTypeReference
                    |> Expect.equal
                        (Just <|
                            Record
                                [ ( "color"
                                  , Record
                                        [ ( "r", Typed [] "Int" [] emptyRange )
                                        , ( "g", Typed [] "Int" [] emptyRange )
                                        , ( "b", Typed [] "Int" [] emptyRange )
                                        ]
                                        emptyRange
                                  )
                                ]
                                emptyRange
                        )
        , test "recordTypeReference with generic" <|
            \() ->
                parseFullStringWithNullState "{color: s }" Parser.typeReference
                    |> Maybe.map noRangeTypeReference
                    |> Expect.equal
                        (Just <|
                            Record
                                [ ( "color"
                                  , GenericType "s" emptyRange
                                  )
                                ]
                                emptyRange
                        )
        , test "function type reference" <|
            \() ->
                parseFullStringWithNullState "Foo -> Bar" Parser.typeReference
                    |> Maybe.map noRangeTypeReference
                    |> Expect.equal
                        (Just <|
                            FunctionTypeReference
                                (Typed [] "Foo" [] emptyRange)
                                (Typed [] "Bar" [] emptyRange)
                                emptyRange
                        )
        , test "function type reference multiple" <|
            \() ->
                parseFullStringWithNullState "Foo -> Bar -> baz" Parser.typeReference
                    |> Maybe.map noRangeTypeReference
                    |> Expect.equal
                        (Just <|
                            FunctionTypeReference
                                (Typed [] "Foo" [] emptyRange)
                                (FunctionTypeReference
                                    (Typed [] "Bar" [] emptyRange)
                                    (GenericType "baz" emptyRange)
                                    emptyRange
                                )
                                emptyRange
                        )
        , test "function type reference generics" <|
            \() ->
                parseFullStringWithNullState "cMsg -> cModel -> a" Parser.typeReference
                    |> Maybe.map noRangeTypeReference
                    |> Expect.equal
                        (Just <|
                            FunctionTypeReference
                                (GenericType "cMsg" emptyRange)
                                (FunctionTypeReference
                                    (GenericType "cModel" emptyRange)
                                    (GenericType "a" emptyRange)
                                    emptyRange
                                )
                                emptyRange
                        )
        , test "function as argument" <|
            \() ->
                parseFullStringWithNullState "( cMsg -> cModel -> a ) -> b" Parser.typeReference
                    |> Maybe.map noRangeTypeReference
                    |> Expect.equal
                        (Just <|
                            FunctionTypeReference
                                (FunctionTypeReference
                                    (GenericType "cMsg" emptyRange)
                                    (FunctionTypeReference
                                        (GenericType "cModel" emptyRange)
                                        (GenericType "a" emptyRange)
                                        emptyRange
                                    )
                                    emptyRange
                                )
                                (GenericType "b" emptyRange)
                                emptyRange
                        )
        , test "type with params" <|
            \() ->
                parseFullStringWithNullState "(Foo -> Bar)" Parser.typeReference
                    |> Maybe.map noRangeTypeReference
                    |> Expect.equal
                        (Just <|
                            FunctionTypeReference
                                (Typed [] "Foo" [] emptyRange)
                                (Typed [] "Bar" [] emptyRange)
                                emptyRange
                        )
        , test "function type reference multiple and parens" <|
            \() ->
                parseFullStringWithNullState "(Foo -> Bar) -> baz" Parser.typeReference
                    |> Maybe.map noRangeTypeReference
                    |> Expect.equal
                        (Just <|
                            FunctionTypeReference
                                (FunctionTypeReference
                                    (Typed [] "Foo" [] emptyRange)
                                    (Typed [] "Bar" [] emptyRange)
                                    emptyRange
                                )
                                (GenericType "baz" emptyRange)
                                emptyRange
                        )
        , test "parseTypeWith wrong indent" <|
            \() ->
                parseFullStringWithNullState "Maybe\na" Parser.typeReference
                    |> Maybe.map noRangeTypeReference
                    |> Expect.equal Nothing
        , test "parseTypeWith good indent" <|
            \() ->
                parseFullStringWithNullState "Maybe\n a" Parser.typeReference
                    |> Maybe.map noRangeTypeReference
                    |> Expect.equal (Just (Typed [] "Maybe" [ Generic "a" ] emptyRange))
        ]
