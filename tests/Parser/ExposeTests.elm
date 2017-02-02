module Parser.ExposeTests exposing (..)

import Parser.Expose exposing (..)
import AST.Types exposing (..)
import AST.Ranges exposing (..)
import Test exposing (..)
import Expect
import Parser.CombineTestUtil exposing (..)


all : Test
all =
    describe "ModuleTests"
        [ test "infixExpose" <|
            \() ->
                parseFullStringWithNullState "($>)" infixExpose
                    |> Maybe.map noRangeExpose
                    |> Expect.equal (Just (InfixExpose "$>" emptyRange))
        , test "definitionExpose" <|
            \() ->
                parseFullStringWithNullState "Model" definitionExpose
                    |> Maybe.map noRangeExpose
                    |> Expect.equal (Just (TypeOrAliasExpose "Model" emptyRange))
        , test "typeExpose" <|
            \() ->
                parseFullStringWithNullState "Msg(Go,Back)" typeExpose
                    |> Maybe.map noRangeExpose
                    |> Expect.equal (Just (TypeExpose "Msg" (Explicit [ ( "Go", emptyRange ), ( "Back", emptyRange ) ]) emptyRange))
        , test "exposingList" <|
            \() ->
                parseFullStringWithNullState " exposing (Model,Msg(Go,Back),Info(..),init,(::))" (exposeDefinition exposable)
                    |> Maybe.map noRangeExposingList
                    |> Expect.equal
                        (Just
                            (Explicit
                                [ TypeOrAliasExpose "Model" emptyRange
                                , TypeExpose "Msg" (Explicit [ ( "Go", emptyRange ), ( "Back", emptyRange ) ]) emptyRange
                                , TypeExpose "Info" (All emptyRange) emptyRange
                                , FunctionExpose "init" emptyRange
                                , InfixExpose "::" emptyRange
                                ]
                            )
                        )
        , test "exposingListInner with comment" <|
            \() ->
                parseFullStringWithNullState "foo\n --bar\n " (exposingListInner exposable)
                    |> Maybe.map noRangeExposingList
                    |> Expect.equal
                        (Just
                            (Explicit
                                [ FunctionExpose "foo" emptyRange
                                ]
                            )
                        )
        , test "exposingList with comment 2" <|
            \() ->
                parseFullStringWithNullState " exposing (foo\n --bar\n )" (exposeDefinition exposable)
                    |> Maybe.map noRangeExposingList
                    |> Expect.equal
                        (Just
                            (Explicit
                                [ FunctionExpose "foo" emptyRange
                                ]
                            )
                        )
        , test "exposingList with spacing" <|
            \() ->
                parseFullStringWithNullState " exposing (Model, Msg(Go,Back) , Info(..),init,(::) )" (exposeDefinition exposable)
                    |> Maybe.map noRangeExposingList
                    |> Expect.equal
                        (Just
                            (Explicit
                                [ TypeOrAliasExpose "Model" emptyRange
                                , TypeExpose "Msg" (Explicit [ ( "Go", emptyRange ), ( "Back", emptyRange ) ]) emptyRange
                                , TypeExpose "Info" (All emptyRange) emptyRange
                                , FunctionExpose "init" emptyRange
                                , InfixExpose "::" emptyRange
                                ]
                            )
                        )
        ]
