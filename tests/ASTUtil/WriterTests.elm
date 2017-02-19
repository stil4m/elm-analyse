module ASTUtil.WriterTests exposing (all)

import ASTUtil.Writer as Writer exposing (..)
import Test exposing (Test, test, describe)
import Expect


all : Test
all =
    describe "Writer"
        [ test "write single line parensComma" <|
            \() ->
                Writer.write
                    (parensComma
                        [ ( { start = { row = 1, column = 1 }, end = { row = 1, column = 2 } }, string "x" )
                        , ( { start = { row = 1, column = 1 }, end = { row = 1, column = 2 } }, string "y" )
                        ]
                    )
                    |> Expect.equal "(x, y)"
        , test "write multi line parensComma" <|
            \() ->
                Writer.write
                    (parensComma
                        [ ( { start = { row = 1, column = 1 }, end = { row = 1, column = 2 } }, string "x" )
                        , ( { start = { row = 2, column = 1 }, end = { row = 2, column = 2 } }, string "y" )
                        ]
                    )
                    |> Expect.equal "(x\n, y)"
        , test "indented breaked" <|
            \() ->
                Writer.write (indent 2 (breaked [ string "a", string "b" ]))
                    |> Expect.equal "  a\n  b"
        ]
