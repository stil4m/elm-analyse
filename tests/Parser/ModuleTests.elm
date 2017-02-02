module Parser.ModuleTests exposing (..)

import AST.Types exposing (..)
import AST.Ranges exposing (emptyRange)
import Expect
import Parser.CombineTestUtil exposing (..)
import Parser.Modules as Parser
import Test exposing (..)


all : Test
all =
    describe "ModuleTests"
        [ test "formatted moduleDefinition" <|
            \() ->
                parseFullStringWithNullState "module Foo exposing (Bar)" Parser.moduleDefinition
                    |> Maybe.map noRangeModule
                    |> Expect.equal
                        (Just
                            (NormalModule
                                { moduleName = [ "Foo" ]
                                , exposingList = Explicit [ TypeOrAliasExpose "Bar" emptyRange ]
                                }
                            )
                        )
        , test "port moduleDefinition" <|
            \() ->
                parseFullStringWithNullState "port module Foo exposing (Bar)" Parser.moduleDefinition
                    |> Maybe.map noRangeModule
                    |> Expect.equal (Just (PortModule { moduleName = [ "Foo" ], exposingList = Explicit [ TypeOrAliasExpose "Bar" emptyRange ] }))
        , test "moduleless" <|
            \() ->
                parseFullStringWithNullState "" Parser.moduleDefinition
                    |> Expect.equal (Just NoModule)
        , test "effect moduleDefinition" <|
            \() ->
                parseFullStringWithNullState "effect module Foo where {command = MyCmd, subscription = MySub } exposing (Bar)" Parser.moduleDefinition
                    |> Maybe.map noRangeModule
                    |> Expect.equal
                        (Just
                            (EffectModule
                                { moduleName = [ "Foo" ]
                                , exposingList = Explicit [ TypeOrAliasExpose "Bar" emptyRange ]
                                , command = Just "MyCmd"
                                , subscription = Just "MySub"
                                }
                            )
                        )
        , test "unformatted" <|
            \() ->
                parseFullStringWithNullState "module \n Foo \n exposing  (..)" Parser.moduleDefinition
                    |> Maybe.map noRangeModule
                    |> Expect.equal (Just (NormalModule { moduleName = [ "Foo" ], exposingList = All emptyRange }))
        , test "unformatted wrong" <|
            \() ->
                parseFullStringWithNullState "module \nFoo \n exposing  (..)" Parser.moduleDefinition
                    |> Expect.equal Nothing
        , test "exposing all" <|
            \() ->
                parseFullStringWithNullState "module Foo exposing (..)" Parser.moduleDefinition
                    |> Maybe.map noRangeModule
                    |> Expect.equal (Just (NormalModule { moduleName = [ "Foo" ], exposingList = All emptyRange }))
        , test "module name with _" <|
            \() ->
                parseFullStringWithNullState "module I_en_gb exposing (..)" Parser.moduleDefinition
                    |> Maybe.map noRangeModule
                    |> Expect.equal (Just (NormalModule { moduleName = [ "I_en_gb" ], exposingList = All emptyRange }))
        ]
