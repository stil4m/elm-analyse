module Parser.TypingsTests exposing (..)

import Parser.Typings as Parser
import AST.Types exposing (..)
import Test exposing (..)
import Expect
import Parser.CombineTestUtil exposing (..)


all : Test
all =
    describe "TypeAlias"
        [ test "type alias" <|
            \() ->
                parseFullStringWithNullState "type alias Foo = {color: String }" Parser.typeAlias
                    |> Expect.equal
                        (Just <|
                            { name = "Foo"
                            , generics = []
                            , typeReference =
                                Record
                                    { fields =
                                        [ ( "color"
                                          , Typed [] "String" []
                                          )
                                        ]
                                    }
                            }
                        )
        , test "type alias with generic " <|
            \() ->
                parseFullStringWithNullState "type alias Foo a = {some : a }" Parser.typeAlias
                    |> Expect.equal
                        (Just <|
                            { name = "Foo"
                            , generics = [ "a" ]
                            , typeReference =
                                Record
                                    { fields =
                                        [ ( "some"
                                          , GenericType "a"
                                          )
                                        ]
                                    }
                            }
                        )
        , test "type" <|
            \() ->
                parseFullStringWithNullState "type Color = Blue String | Red | Green" Parser.typeDeclaration
                    |> Expect.equal
                        (Just { name = "Color", generics = [], constructors = [ { name = "Blue", arguments = [ Typed [] "String" [] ], range = { start = { row = 1, column = 13 }, end = { row = 1, column = 25 } } }, { name = "Red", arguments = [], range = { start = { row = 1, column = 27 }, end = { row = 1, column = 30 } } }, { name = "Green", arguments = [], range = { start = { row = 1, column = 33 }, end = { row = 1, column = 38 } } } ] })
        , test "type with generic " <|
            \() ->
                parseFullStringWithNullState "type Maybe a = Just a | Nothing" Parser.typeDeclaration
                    |> Expect.equal
                        (Just { name = "Maybe", generics = [ "a" ], constructors = [ { name = "Just", arguments = [ GenericType "a" ], range = { start = { row = 1, column = 15 }, end = { row = 1, column = 21 } } }, { name = "Nothing", arguments = [], range = { start = { row = 1, column = 24 }, end = { row = 1, column = 31 } } } ] })
        , test "type with value on next line " <|
            \() ->
                parseFullStringWithNullState "type Maybe a = Just a |\nNothing" Parser.typeDeclaration
                    |> Expect.equal Nothing
          -- , test "some type alias" <|
          --     \() ->
          --         parseFullStringWithNullState "type alias SendPort msg model = model -> Cmd msg" Parser.typeAlias
          --             |> Expect.equal Nothing
        ]
