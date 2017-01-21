module GlslTests exposing (..)

import CombineTestUtil exposing (..)
import Expect
import Parser.Declarations as Parser exposing (..)
import Parser.Types as Types exposing (..)
import Test exposing (..)


all : Test
all =
    describe "GlslTests"
        [ test "case block" <|
            \() ->
                parseFullStringState emptyState "[glsl| precision mediump float; |]" Parser.glslExpression
                    |> Expect.equal (Just (GLSLExpression " precision mediump float; "))
        ]
