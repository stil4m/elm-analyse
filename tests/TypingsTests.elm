module TypingsTests exposing (..)

import Parser.Typings as Parser
import Parser.Types exposing (..)
import Test exposing (..)
import Expect
import CombineTestUtil exposing (..)


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
                        (Just <|
                            { name = "Color"
                            , generics = []
                            , cases =
                                [ { name = "Blue", arguments = [ Typed [] "String" [] ] }
                                , { name = "Red", arguments = [] }
                                , { name = "Green", arguments = [] }
                                ]
                            }
                        )
        , test "type with generic " <|
            \() ->
                parseFullStringWithNullState "type Maybe a = Just a | Nothing" Parser.typeDeclaration
                    |> Expect.equal
                        (Just <|
                            { name = "Maybe"
                            , generics = [ "a" ]
                            , cases =
                                [ { name = "Just", arguments = [ GenericType "a" ] }
                                , { name = "Nothing", arguments = [] }
                                ]
                            }
                        )
        , test "type with value on next line " <|
            \() ->
                parseFullStringWithNullState "type Maybe a = Just a |\nNothing" Parser.typeDeclaration
                    |> Expect.equal Nothing
          -- , test "some type alias" <|
          --     \() ->
          --         parseFullStringWithNullState "type alias SendPort msg model = model -> Cmd msg" Parser.typeAlias
          --             |> Expect.equal Nothing
        ]
