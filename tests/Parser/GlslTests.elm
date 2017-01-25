module Parser.GlslTests exposing (..)

import Parser.CombineTestUtil exposing (..)
import Expect
import Parser.Declarations as Parser exposing (..)
import AST.Types as Types exposing (..)
import Test exposing (..)


all : Test
all =
    describe "GlslTests"
        [ test "case block" <|
            \() ->
                parseFullStringState emptyState "[glsl| precision mediump float; |]" Parser.glslExpression
                    |> Expect.equal (Just (GLSLExpression " precision mediump float; "))
        ]
