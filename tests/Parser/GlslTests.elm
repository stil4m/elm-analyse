module Parser.GlslTests exposing (..)

import Parser.CombineTestUtil exposing (..)
import Expect
import Parser.Declarations as Parser exposing (..)
import AST.Types exposing (..)
import Test exposing (..)
import Parser.State exposing (emptyState)


all : Test
all =
    describe "GlslTests"
        [ test "case block" <|
            \() ->
                parseFullStringState emptyState "[glsl| precision mediump float; |]" Parser.expression
                    |> Maybe.map noRangeExpression
                    |> Expect.equal (Just (emptyRanged <| GLSLExpression " precision mediump float; "))
        ]
