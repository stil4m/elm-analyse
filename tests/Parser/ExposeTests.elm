module Parser.ExposeTests exposing (..)

import Parser.Expose as Parser
import Parser.Types as Parser
import Test exposing (..)
import Expect
import Parser.CombineTestUtil exposing (..)


all : Test
all =
    describe "ModuleTests"
        [ test "infixExpose" <|
            \() ->
                parseFullStringWithNullState "($>)" Parser.infixExpose
                    |> Expect.equal (Just (Parser.InfixExpose "$>"))
        , test "definitionExpose" <|
            \() ->
                parseFullStringWithNullState "Model" Parser.definitionExpose
                    |> Expect.equal (Just (Parser.DefinitionExpose "Model"))
        , test "typeExpose" <|
            \() ->
                parseFullStringWithNullState "Msg(Go,Back)" Parser.typeExpose
                    |> Expect.equal (Just (Parser.TypeExpose "Msg" (Parser.Explicit [ "Go", "Back" ])))
        , test "exposingList" <|
            \() ->
                parseFullStringWithNullState " exposing (Model,Msg(Go,Back),Info(..),init,(::))" (Parser.exposeDefinition Parser.exposable)
                    |> Expect.equal
                        (Just
                            (Parser.Explicit
                                [ Parser.DefinitionExpose "Model"
                                , Parser.TypeExpose "Msg" <| Parser.Explicit [ "Go", "Back" ]
                                , Parser.TypeExpose "Info" <| Parser.All
                                , Parser.DefinitionExpose "init"
                                , Parser.InfixExpose "::"
                                ]
                            )
                        )
        , test "exposingListInner with comment" <|
            \() ->
                parseFullStringWithNullState "foo\n --bar\n " (Parser.exposingListInner Parser.exposable)
                    |> Expect.equal
                        (Just
                            (Parser.Explicit
                                [ Parser.DefinitionExpose "foo"
                                ]
                            )
                        )
        , test "exposingList with comment" <|
            \() ->
                parseFullStringWithNullState " exposing (foo\n --bar\n )" (Parser.exposeDefinition Parser.exposable)
                    |> Expect.equal
                        (Just
                            (Parser.Explicit
                                [ Parser.DefinitionExpose "foo"
                                ]
                            )
                        )
        , test "exposingList with spacing" <|
            \() ->
                parseFullStringWithNullState " exposing (Model, Msg(Go,Back) , Info(..),init,(::) )" (Parser.exposeDefinition Parser.exposable)
                    |> Expect.equal
                        (Just
                            (Parser.Explicit
                                [ Parser.DefinitionExpose "Model"
                                , Parser.TypeExpose "Msg" <| Parser.Explicit [ "Go", "Back" ]
                                , Parser.TypeExpose "Info" <| Parser.All
                                , Parser.DefinitionExpose "init"
                                , Parser.InfixExpose "::"
                                ]
                            )
                        )
        ]
