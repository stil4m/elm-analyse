module TokenTests exposing (..)

import Parser.Tokens as Parser
import Parser.Types as Types
import Test exposing (..)
import Expect
import CombineTestUtil exposing (..)


all : Test
all =
    describe "TokenTests"
        [ test "functionName" <|
            \() ->
                parseFullString "foo" Parser.functionName
                    |> Expect.equal (Just "foo")
        , test "functionName not empty" <|
            \() ->
                parseFullString "" Parser.functionName
                    |> Expect.equal Nothing
        , test "functionName with number" <|
            \() ->
                parseFullString "n1" Parser.functionName
                    |> Expect.equal (Just "n1")
        , test "functionName is not matched with 'if'" <|
            \() ->
                parseFullString "if" Parser.functionName
                    |> Expect.equal Nothing
        , test "functionName with _" <|
            \() ->
                parseFullString "foo_" Parser.functionName
                    |> Expect.equal (Just "foo_")
        , test "typeName" <|
            \() ->
                parseFullString "MyCmd" Parser.typeName
                    |> Expect.equal (Just "MyCmd")
        , test "typeName not empty" <|
            \() ->
                parseFullString "" Parser.typeName
                    |> Expect.equal Nothing
        , test "typeName with number" <|
            \() ->
                parseFullString "T1" Parser.typeName
                    |> Expect.equal (Just "T1")
        , test "functionOrTypeName as function" <|
            \() ->
                parseFullString "foo" Parser.functionOrTypeName
                    |> Expect.equal (Just "foo")
        , test "functionOrTypeName as type" <|
            \() ->
                parseFullString "Foo" Parser.functionOrTypeName
                    |> Expect.equal (Just "Foo")
        , test "moduleToken" <|
            \() ->
                parseFullString "module" Parser.moduleToken
                    |> Expect.equal (Just "module")
        , test "moduleName" <|
            \() ->
                parseFullString "Foo" Parser.moduleName
                    |> Expect.equal (Just <| Types.ModuleName [ "Foo" ])
        , test "moduleNameDir" <|
            \() ->
                parseFullString "Foo.Bar" Parser.moduleName
                    |> Expect.equal (Just <| Types.ModuleName [ "Foo", "Bar" ])
        , test "exposingToken" <|
            \() ->
                parseFullString "exposing" Parser.exposingToken
                    |> Expect.equal (Just "exposing")
        , test "operatorToken 1" <|
            \() ->
                parseFullString "++" Parser.infixOperatorToken
                    |> Expect.equal (Just "++")
        , test "operatorToken 2" <|
            \() ->
                parseFullString "//" Parser.infixOperatorToken
                    |> Expect.equal (Just "//")
        , test "operatorToken 3" <|
            \() ->
                parseFullString "*" Parser.infixOperatorToken
                    |> Expect.equal (Just "*")
        , test "operatorToken 4" <|
            \() ->
                parseFullString ":" Parser.infixOperatorToken
                    |> Expect.equal Nothing
        , test "operatorToken 5" <|
            \() ->
                parseFullString "->" Parser.infixOperatorToken
                    |> Expect.equal Nothing
        , test "operatorToken 6" <|
            \() ->
                parseFullString "\\" Parser.infixOperatorToken
                    |> Expect.equal Nothing
        , test "operatorToken 7" <|
            \() ->
                parseFullString "." Parser.infixOperatorToken
                    |> Expect.equal (Just ".")
        , test "operatorToken 8" <|
            \() ->
                parseFullString "$" Parser.infixOperatorToken
                    |> Expect.equal (Just "$")
        , test "operatorToken 9" <|
            \() ->
                parseFullString "#" Parser.infixOperatorToken
                    |> Expect.equal (Just "#")
        , test "operatorToken 10 - , is not an infix operator" <|
            \() ->
                parseFullString "," Parser.infixOperatorToken
                    |> Expect.equal Nothing
        , test "operatorToken 11 -- is not an operator" <|
            \() ->
                parseFullString "--" Parser.prefixOperatorToken
                    |> Expect.equal Nothing
        , test "multiline string" <|
            \() ->
                parseFullString "\"\"\"Bar foo \n a\"\"\"" Parser.multiLineStringLiteral
                    |> Expect.equal (Just "Bar foo \n a")
        ]
