module Parser.FileTests exposing (..)

import Parser.CombineTestUtil exposing (..)
import Expect
import Parser.Declarations as Parser exposing (..)
import AST.Types as Types exposing (..)
import Parser.Samples as Samples
import Test exposing (..)


all : Test
all =
    describe "FileTests"
        [ test "declaration" <|
            \() ->
                parseFullStringState emptyState "main =\n  text \"Hello, World!\"" Parser.functionDeclaration
                    |> Expect.equal
                        (Just
                            { operatorDefinition = False
                            , name = "main"
                            , arguments = []
                            , expression =
                                Application
                                    [ FunctionOrValue "text"
                                    , Literal "Hello, World!"
                                    ]
                            }
                        )
        , test "function" <|
            (\() ->
                parseFullStringState emptyState "main =\n  text \"Hello, World!\"" Parser.function
                    |> Expect.equal
                        (Just
                            { documentation = Nothing
                            , signature = Nothing
                            , declaration =
                                { operatorDefinition = False
                                , name = "main"
                                , arguments = []
                                , expression =
                                    Application
                                        [ FunctionOrValue "text"
                                        , Literal "Hello, World!"
                                        ]
                                }
                            }
                        )
            )
        , Samples.allSamples
            |> List.indexedMap
                (\n s ->
                    test ("sample " ++ toString (n + 1)) <|
                        \() ->
                            parseFullStringState emptyState s Parser.file
                                |> Expect.notEqual Nothing
                )
            |> Test.concat
        ]
