module TypeReferenceTests exposing (..)

import Parser.TypeReference as Parser
import Parser.Types exposing (..)
import Test exposing (..)
import Expect
import CombineTestUtil exposing (..)


all : Test
all =
    describe "TypeReferenceTests"
        [ test "unitTypeReference" <|
            \() ->
                parseFullStringWithNullState "()" Parser.unitTypeReference
                    |> Expect.equal (Just Unit)
        , test "unitTypeReference with spaces" <|
            \() ->
                parseFullStringWithNullState "( )" Parser.unitTypeReference
                    |> Expect.equal (Just Unit)
        , test "tupledTypeReference" <|
            \() ->
                parseFullStringWithNullState "( (), ())" Parser.tupledTypeReference
                    |> Expect.equal (Just <| Tupled [ Unit, Unit ])
        , test "tupledTypeReference 2" <|
            \() ->
                parseFullStringWithNullState "( () )" Parser.tupledTypeReference
                    |> Expect.equal Nothing
        , test "tupledTypeReference 3" <|
            \() ->
                parseFullStringWithNullState "( Int , Maybe m )" Parser.tupledTypeReference
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
                parseFullStringWithNullState "Bar" Parser.typeReferenceNoFn
                    |> Expect.equal (Just (Typed [] "Bar" []))
        , test "typeArg" <|
            \() ->
                parseFullStringWithNullState "Bar" Parser.typeArg
                    |> Expect.equal (Just (Concrete (Typed [] "Bar" [])))
        , test "typedTypeReference 1" <|
            \() ->
                parseFullStringWithNullState "Foo () a Bar" Parser.typedTypeReference
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
                parseFullStringWithNullState "Foo () a Bar" Parser.typedTypeReference
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
                parseFullStringWithNullState "{}" Parser.recordTypeReference
                    |> Expect.equal
                        (Just <|
                            Record { fields = [] }
                        )
        , test "recordTypeReference one field" <|
            \() ->
                parseFullStringWithNullState "{color: String }" Parser.recordTypeReference
                    |> Expect.equal
                        (Just <|
                            Record { fields = [ ( "color", Typed [] "String" [] ) ] }
                        )
        , test "recordTypeReference nested record" <|
            \() ->
                parseFullStringWithNullState "{color: {r : Int, g :Int, b: Int } }" Parser.recordTypeReference
                    |> Expect.equal
                        (Just <|
                            Record
                                { fields =
                                    [ ( "color"
                                      , Record
                                            { fields =
                                                [ ( "r", Typed [] "Int" [] )
                                                , ( "g", Typed [] "Int" [] )
                                                , ( "b", Typed [] "Int" [] )
                                                ]
                                            }
                                      )
                                    ]
                                }
                        )
        , test "recordTypeReference with generic" <|
            \() ->
                parseFullStringWithNullState "{color: s }" Parser.recordTypeReference
                    |> Expect.equal
                        (Just <|
                            Record
                                { fields =
                                    [ ( "color"
                                      , GenericType "s"
                                      )
                                    ]
                                }
                        )
        , test "function type reference" <|
            \() ->
                parseFullStringWithNullState "Foo -> Bar" Parser.functionTypeReference
                    |> Expect.equal (Just <| FunctionTypeReference (Typed [] "Foo" []) (Typed [] "Bar" []))
        , test "function type reference multiple" <|
            \() ->
                parseFullStringWithNullState "Foo -> Bar -> baz" Parser.functionTypeReference
                    |> Expect.equal
                        (Just <|
                            FunctionTypeReference
                                (Typed [] "Foo" [])
                                (FunctionTypeReference
                                    (Typed [] "Bar" [])
                                    (GenericType "baz")
                                )
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
                parseFullStringWithNullState "(Foo -> Bar) -> baz" Parser.functionTypeReference
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
