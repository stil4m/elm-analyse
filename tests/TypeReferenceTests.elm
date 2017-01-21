module TypeReferenceTests exposing (..)

import Parser.TypeReference as Parser
import Parser.Types as Parser
import Test exposing (..)
import Expect
import CombineTestUtil exposing (..)


all : Test
all =
    describe "TypeReferenceTests"
        [ test "unitTypeReference" <|
            \() ->
                parseFullStringWithNullState "()" Parser.unitTypeReference
                    |> Expect.equal (Just Parser.Unit)
        , test "unitTypeReference with spaces" <|
            \() ->
                parseFullStringWithNullState "( )" Parser.unitTypeReference
                    |> Expect.equal (Just Parser.Unit)
        , test "tupledTypeReference" <|
            \() ->
                parseFullStringWithNullState "( (), ())" Parser.tupledTypeReference
                    |> Expect.equal (Just <| Parser.Tupled [ Parser.Unit, Parser.Unit ])
        , test "tupledTypeReference 2" <|
            \() ->
                parseFullStringWithNullState "( () )" Parser.tupledTypeReference
                    |> Expect.equal Nothing
        , test "tupledTypeReference 3" <|
            \() ->
                parseFullStringWithNullState "( Int , Maybe m )" Parser.tupledTypeReference
                    |> Expect.equal
                        (Just
                            (Parser.Tupled
                                [ Parser.Typed [] "Int" []
                                , Parser.Typed [] "Maybe" [ Parser.Generic "m" ]
                                ]
                            )
                        )
        , test "qualified type reference" <|
            \() ->
                parseFullStringWithNullState "Foo.Bar" Parser.typeReference
                    |> Expect.equal (Just (Parser.Typed [ "Foo" ] "Bar" []))
        , test "typeReferenceNoFn" <|
            \() ->
                parseFullStringWithNullState "Bar" Parser.typeReferenceNoFn
                    |> Expect.equal (Just (Parser.Typed [] "Bar" []))
        , test "typeArg" <|
            \() ->
                parseFullStringWithNullState "Bar" Parser.typeArg
                    |> Expect.equal (Just (Parser.Concrete (Parser.Typed [] "Bar" [])))
        , test "typedTypeReference 1" <|
            \() ->
                parseFullStringWithNullState "Foo () a Bar" Parser.typedTypeReference
                    |> Expect.equal
                        (Just <|
                            Parser.Typed []
                                "Foo"
                                [ Parser.Concrete Parser.Unit
                                , Parser.Generic "a"
                                , Parser.Concrete (Parser.Typed [] "Bar" [])
                                ]
                        )
        , test "typedTypeReference 2" <|
            \() ->
                parseFullStringWithNullState "Foo () a Bar" Parser.typedTypeReference
                    |> Expect.equal
                        (Just <|
                            Parser.Typed []
                                "Foo"
                                [ Parser.Concrete Parser.Unit
                                , Parser.Generic "a"
                                , Parser.Concrete (Parser.Typed [] "Bar" [])
                                ]
                        )
        , test "recordTypeReference empty" <|
            \() ->
                parseFullStringWithNullState "{}" Parser.recordTypeReference
                    |> Expect.equal
                        (Just <|
                            Parser.Record { fields = [] }
                        )
        , test "recordTypeReference one field" <|
            \() ->
                parseFullStringWithNullState "{color: String }" Parser.recordTypeReference
                    |> Expect.equal
                        (Just <|
                            Parser.Record { fields = [ ( "color", Parser.Typed [] "String" [] ) ] }
                        )
        , test "recordTypeReference nested record" <|
            \() ->
                parseFullStringWithNullState "{color: {r : Int, g :Int, b: Int } }" Parser.recordTypeReference
                    |> Expect.equal
                        (Just <|
                            Parser.Record
                                { fields =
                                    [ ( "color"
                                      , Parser.Record
                                            { fields =
                                                [ ( "r", Parser.Typed [] "Int" [] )
                                                , ( "g", Parser.Typed [] "Int" [] )
                                                , ( "b", Parser.Typed [] "Int" [] )
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
                            Parser.Record
                                { fields =
                                    [ ( "color"
                                      , Parser.GenericType "s"
                                      )
                                    ]
                                }
                        )
        , test "function type reference" <|
            \() ->
                parseFullStringWithNullState "Foo -> Bar" Parser.functionTypeReference
                    |> Expect.equal (Just <| Parser.Function (Parser.Typed [] "Foo" []) (Parser.Typed [] "Bar" []))
        , test "function type reference multiple" <|
            \() ->
                parseFullStringWithNullState "Foo -> Bar -> baz" Parser.functionTypeReference
                    |> Expect.equal
                        (Just <|
                            Parser.Function
                                (Parser.Typed [] "Foo" [])
                                (Parser.Function
                                    (Parser.Typed [] "Bar" [])
                                    (Parser.GenericType "baz")
                                )
                        )
        , test "type with params" <|
            \() ->
                parseFullStringWithNullState "(Foo -> Bar)" Parser.typeReference
                    |> Expect.equal
                        (Just <|
                            Parser.Function
                                (Parser.Typed [] "Foo" [])
                                (Parser.Typed [] "Bar" [])
                        )
        , test "function type reference multiple and parens" <|
            \() ->
                parseFullStringWithNullState "(Foo -> Bar) -> baz" Parser.functionTypeReference
                    |> Expect.equal
                        (Just <|
                            Parser.Function
                                (Parser.Function
                                    (Parser.Typed [] "Foo" [])
                                    (Parser.Typed [] "Bar" [])
                                )
                                (Parser.GenericType "baz")
                        )
        , test "parseTypeWith wrong indent" <|
            \() ->
                parseFullStringWithNullState "Maybe\na" Parser.typeReference
                    |> Expect.equal Nothing
        , test "parseTypeWith good indent" <|
            \() ->
                parseFullStringWithNullState "Maybe\n a" Parser.typeReference
                    |> Expect.equal (Just (Parser.Typed [] "Maybe" [ Parser.Generic "a" ]))
        ]
