module Parser.InfixTests exposing (..)

import Parser.CombineTestUtil exposing (..)
import Expect
import AST.Types exposing (..)
import Test exposing (..)
import Parser.Infix as Infix exposing (..)
import Parser.State exposing (emptyState)


all : Test
all =
    describe "InfixTests"
        [ test "right infix" <|
            \() ->
                parseFullStringState emptyState "infixr 3 <<" Infix.infixDefinition
                    |> Expect.equal (Just { direction = Right, precedence = 3, operator = "<<" })
        , test "left infix" <|
            \() ->
                parseFullStringState emptyState "infixl 5 >>" Infix.infixDefinition
                    |> Expect.equal (Just { direction = Left, precedence = 5, operator = ">>" })
        , test "infix neutral" <|
            \() ->
                parseFullStringState emptyState "infix 2 >>" Infix.infixDefinition
                    |> Expect.equal (Just { direction = Left, precedence = 2, operator = ">>" })
        ]
