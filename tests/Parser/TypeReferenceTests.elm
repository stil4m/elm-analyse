module Parser.TypeReferenceTests exposing (..)

import Parser.TypeReference as Parser
import AST.Types exposing (..)
import Test exposing (..)
import Expect
import Parser.CombineTestUtil exposing (..)


all : Test
all =
    describe "TypeReferenceTests"
        [ test "unitTypeReference" <|
            \() ->
                parseFullStringWithNullState "()" Parser.typeReference
                    |> Expect.equal (Just Unit)
        , test "unitTypeReference with spaces" <|
            \() ->
                parseFullStringWithNullState "( )" Parser.typeReference
                    |> Expect.equal (Just Unit)
        , test "tupledTypeReference" <|
            \() ->
                parseFullStringWithNullState "( (), ())" Parser.typeReference
                    |> Expect.equal (Just <| Tupled [ Unit, Unit ])
        , test "tupledTypeReference 2" <|
            \() ->
                parseFullStringWithNullState "( () )" Parser.tupledTypeReference
                    |> Expect.equal Nothing
        , test "tupledTypeReference 3" <|
            \() ->
                parseFullStringWithNullState "( Int , Maybe m )" Parser.typeReference
                    |> Expect.equal
                        (Just
                            (Tupled
                                [ Typed [] "Int" []
                                , Typed [] "Maybe" [ Generic "m" ]
                                ]
                            )
                        )
        , test "qualified type reference" <|
            \() ->
                parseFullStringWithNullState "Foo.Bar" Parser.typeReference
                    |> Expect.equal (Just (Typed [ "Foo" ] "Bar" []))
        , test "typeReferenceNoFn" <|
            \() ->
                parseFullStringWithNullState "Bar" Parser.typeReference
                    |> Expect.equal (Just (Typed [] "Bar" []))
        , test "typedTypeReference 1" <|
            \() ->
                parseFullStringWithNullState "Foo () a Bar" Parser.typeReference
                    |> Expect.equal
                        (Just <|
                            Typed []
                                "Foo"
                                [ Concrete Unit
                                , Generic "a"
                                , Concrete (Typed [] "Bar" [])
                                ]
                        )
        , test "typedTypeReference 2" <|
            \() ->
                parseFullStringWithNullState "Foo () a Bar" Parser.typeReference
                    |> Expect.equal
                        (Just <|
                            Typed []
                                "Foo"
                                [ Concrete Unit
                                , Generic "a"
                                , Concrete (Typed [] "Bar" [])
                                ]
                        )
        , test "recordTypeReference empty" <|
            \() ->
                parseFullStringWithNullState "{}" Parser.typeReference
                    |> Expect.equal
                        (Just <|
                            Record []
                        )
        , test "recordTypeReference one field" <|
            \() ->
                parseFullStringWithNullState "{color: String }" Parser.typeReference
                    |> Expect.equal
                        (Just <|
                            Record [ ( "color", Typed [] "String" [] ) ]
                        )
        , test "recordTypeReference nested record" <|
            \() ->
                parseFullStringWithNullState "{color: {r : Int, g :Int, b: Int } }" Parser.typeReference
                    |> Expect.equal
                        (Just <|
                            Record
                                [ ( "color"
                                  , Record
                                        [ ( "r", Typed [] "Int" [] )
                                        , ( "g", Typed [] "Int" [] )
                                        , ( "b", Typed [] "Int" [] )
                                        ]
                                  )
                                ]
                        )
        , test "recordTypeReference with generic" <|
            \() ->
                parseFullStringWithNullState "{color: s }" Parser.typeReference
                    |> Expect.equal
                        (Just <|
                            Record
                                [ ( "color"
                                  , GenericType "s"
                                  )
                                ]
                        )
        , test "function type reference" <|
            \() ->
                parseFullStringWithNullState "Foo -> Bar" Parser.typeReference
                    |> Expect.equal (Just <| FunctionTypeReference (Typed [] "Foo" []) (Typed [] "Bar" []))
        , test "function type reference multiple" <|
            \() ->
                parseFullStringWithNullState "Foo -> Bar -> baz" Parser.typeReference
                    |> Expect.equal
                        (Just <|
                            FunctionTypeReference
                                (Typed [] "Foo" [])
                                (FunctionTypeReference
                                    (Typed [] "Bar" [])
                                    (GenericType "baz")
                                )
                        )
        , test "function type reference generics" <|
            \() ->
                parseFullStringWithNullState "cMsg -> cModel -> a" Parser.typeReference
                    |> Expect.equal
                        (Just <|
                            FunctionTypeReference
                                (GenericType "cMsg")
                                (FunctionTypeReference
                                    (GenericType "cModel")
                                    (GenericType "a")
                                )
                        )
        , test "function as argument" <|
            \() ->
                parseFullStringWithNullState "( cMsg -> cModel -> a ) -> b" Parser.typeReference
                    |> Expect.equal
                        (Just <|
                            FunctionTypeReference
                                (FunctionTypeReference
                                    (GenericType "cMsg")
                                    (FunctionTypeReference
                                        (GenericType "cModel")
                                        (GenericType "a")
                                    )
                                )
                                (GenericType "b")
                        )
        , test "type with params" <|
            \() ->
                parseFullStringWithNullState "(Foo -> Bar)" Parser.typeReference
                    |> Expect.equal
                        (Just <|
                            FunctionTypeReference
                                (Typed [] "Foo" [])
                                (Typed [] "Bar" [])
                        )
        , test "function type reference multiple and parens" <|
            \() ->
                parseFullStringWithNullState "(Foo -> Bar) -> baz" Parser.typeReference
                    |> Expect.equal
                        (Just <|
                            FunctionTypeReference
                                (FunctionTypeReference
                                    (Typed [] "Foo" [])
                                    (Typed [] "Bar" [])
                                )
                                (GenericType "baz")
                        )
        , test "parseTypeWith wrong indent" <|
            \() ->
                parseFullStringWithNullState "Maybe\na" Parser.typeReference
                    |> Expect.equal Nothing
        , test "parseTypeWith good indent" <|
            \() ->
                parseFullStringWithNullState "Maybe\n a" Parser.typeReference
                    |> Expect.equal (Just (Typed [] "Maybe" [ Generic "a" ]))
        ]
