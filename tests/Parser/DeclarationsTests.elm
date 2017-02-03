module Parser.DeclarationsTests exposing (..)

import Combine exposing ((*>), Parser)
import Parser.CombineTestUtil exposing (..)
import Expect
import Parser.Declarations as Parser exposing (..)
import Parser.Imports exposing (importDefinition)
import Parser.Modules exposing (moduleDefinition)
import AST.Types as Types exposing (..)
import AST.Ranges exposing (emptyRange)
import Parser.Util exposing (exactIndentWhitespace)
import Test exposing (..)


all : Test
all =
    describe "DeclarationTests"
        [ test "normal signature" <|
            \() ->
                parseFullStringWithNullState "foo : Int" Parser.signature
                    |> Expect.equal
                        (Just
                            { operatorDefinition = False
                            , name = "foo"
                            , typeReference = Types.Typed [] "Int" []
                            }
                        )
        , test "no spacing signature" <|
            \() ->
                parseFullStringWithNullState "foo:Int" Parser.signature
                    |> Expect.equal
                        (Just
                            { operatorDefinition = False
                            , name = "foo"
                            , typeReference = Types.Typed [] "Int" []
                            }
                        )
        , test "on newline signature with wrong indent " <|
            \() ->
                parseFullStringWithNullState "foo :\nInt" Parser.signature
                    |> Expect.equal Nothing
        , test "on newline signature with good indent" <|
            \() ->
                parseFullStringWithNullState "foo :\n Int" Parser.signature
                    |> Expect.equal
                        (Just
                            { operatorDefinition = False
                            , name = "foo"
                            , typeReference = Types.Typed [] "Int" []
                            }
                        )
        , test "on newline signature with colon on start of line" <|
            \() ->
                parseFullStringWithNullState "foo\n:\n Int" Parser.signature
                    |> Expect.equal Nothing
        , test "function declaration" <|
            \() ->
                parseFullStringWithNullState "foo = bar" Parser.functionDeclaration
                    |> Maybe.map noRangeFunctionDeclaration
                    |> Expect.equal
                        (Just
                            { operatorDefinition = False
                            , name = { value = "foo", range = emptyRange }
                            , arguments = []
                            , expression = emptyRanged <| FunctionOrValue "bar"
                            }
                        )
        , test "operator declarations" <|
            \() ->
                parseFullStringWithNullState "(&>) = flip Maybe.andThen" Parser.functionDeclaration
                    |> Maybe.map noRangeFunctionDeclaration
                    |> Expect.equal
                        (Just
                            { operatorDefinition = True
                            , name = { value = "&>", range = emptyRange }
                            , arguments = []
                            , expression =
                                emptyRanged <|
                                    Application
                                        ([ emptyRanged <| FunctionOrValue "flip"
                                         , emptyRanged <| QualifiedExpr [ "Maybe" ] "andThen"
                                         ]
                                        )
                            }
                        )
        , test "function declaration with args" <|
            \() ->
                parseFullStringWithNullState "inc x = x + 1" Parser.functionDeclaration
                    |> Maybe.map noRangeFunctionDeclaration
                    |> Expect.equal
                        (Just
                            { operatorDefinition = False
                            , name = { value = "inc", range = emptyRange }
                            , arguments = [ VarPattern { value = "x", range = emptyRange } ]
                            , expression =
                                emptyRanged <|
                                    Application
                                        ([ emptyRanged <| FunctionOrValue "x"
                                         , emptyRanged <| Operator "+"
                                         , emptyRanged <| Integer 1
                                         ]
                                        )
                            }
                        )
        , test "some signature" <|
            \() ->
                parseFullStringWithNullState "bar : List ( Int , Maybe m )" Parser.signature
                    |> Expect.equal
                        (Just
                            { operatorDefinition = False
                            , name = "bar"
                            , typeReference =
                                Typed []
                                    "List"
                                    [ Concrete
                                        (Tupled
                                            [ Typed [] "Int" []
                                            , Typed [] "Maybe" [ Generic "m" ]
                                            ]
                                        )
                                    ]
                            }
                        )
        , test "function declaration with let" <|
            \() ->
                parseFullStringWithNullState "foo =\n let\n  b = 1\n in\n  b" Parser.functionDeclaration
                    |> Maybe.map noRangeFunctionDeclaration
                    |> Expect.equal
                        (Just
                            { operatorDefinition = False
                            , name = { value = "foo", range = emptyRange }
                            , arguments = []
                            , expression =
                                emptyRanged <|
                                    LetExpression
                                        { declarations =
                                            [ FuncDecl
                                                { documentation = Nothing
                                                , signature = Nothing
                                                , declaration =
                                                    { operatorDefinition = False
                                                    , name =
                                                        { value = "b"
                                                        , range = emptyRange
                                                        }
                                                    , arguments = []
                                                    , expression = emptyRanged <| Integer 1
                                                    }
                                                }
                                            ]
                                        , expression = emptyRanged <| FunctionOrValue "b"
                                        }
                            }
                        )
        , test "declaration with record" <|
            \() ->
                parseFullStringWithNullState "main =\n  beginnerProgram { model = 0, view = view, update = update }" Parser.functionDeclaration
                    |> Maybe.map noRangeFunctionDeclaration
                    |> Expect.equal
                        (Just
                            { operatorDefinition = False
                            , name = { value = "main", range = emptyRange }
                            , arguments = []
                            , expression =
                                emptyRanged <|
                                    Application
                                        ([ emptyRanged <| FunctionOrValue "beginnerProgram"
                                         , emptyRanged <|
                                            RecordExpr
                                                ([ ( "model", emptyRanged <| Integer 0 )
                                                 , ( "view", emptyRanged <| FunctionOrValue "view" )
                                                 , ( "update", emptyRanged <| FunctionOrValue "update" )
                                                 ]
                                                )
                                         ]
                                        )
                            }
                        )
        , test "update function" <|
            \() ->
                parseFullStringWithNullState "update msg model =\n  case msg of\n    Increment ->\n      model + 1\n\n    Decrement ->\n      model - 1" Parser.functionDeclaration
                    |> Maybe.map noRangeFunctionDeclaration
                    |> Expect.equal
                        (Just
                            { operatorDefinition = False
                            , name = { value = "update", range = emptyRange }
                            , arguments = [ VarPattern { value = "msg", range = emptyRange }, VarPattern { value = "model", range = emptyRange } ]
                            , expression =
                                emptyRanged <|
                                    CaseExpression
                                        { expression = emptyRanged <| FunctionOrValue "msg"
                                        , cases =
                                            [ ( NamedPattern (QualifiedNameRef [] "Increment" emptyRange) []
                                              , emptyRanged <|
                                                    Application
                                                        ([ emptyRanged <| FunctionOrValue "model"
                                                         , emptyRanged <| Operator "+"
                                                         , emptyRanged <| Integer 1
                                                         ]
                                                        )
                                              )
                                            , ( NamedPattern (QualifiedNameRef [] "Decrement" emptyRange) []
                                              , emptyRanged <|
                                                    Application
                                                        ([ emptyRanged <| FunctionOrValue "model"
                                                         , emptyRanged <| Operator "-"
                                                         , emptyRanged <| Integer 1
                                                         ]
                                                        )
                                              )
                                            ]
                                        }
                            }
                        )
        , test "port declaration" <|
            \() ->
                parseFullStringWithNullState "port parseResponse : ( String, String ) -> Cmd msg" Parser.declaration
                    |> Expect.equal
                        (Just
                            (PortDeclaration
                                { operatorDefinition = False
                                , name = "parseResponse"
                                , typeReference =
                                    (FunctionTypeReference
                                        (Tupled [ Typed [] "String" [], Typed [] "String" [] ])
                                        (Typed [] "Cmd" [ Generic "msg" ])
                                    )
                                }
                            )
                        )
        , test "no-module and then import" <|
            \() ->
                parseFullStringWithNullState "import Html" file
                    |> Maybe.map noRangeFile
                    |> Expect.equal
                        (Just
                            { moduleDefinition =
                                NoModule
                            , imports =
                                [ { moduleName = [ "Html" ]
                                  , moduleAlias = Nothing
                                  , exposingList = Types.None
                                  , range = emptyRange
                                  }
                                ]
                            , declarations = []
                            }
                        )
        , test "port declaration" <|
            \() ->
                parseFullStringWithNullState "port scroll : (Move -> msg) -> Sub msg" declaration
                    |> Maybe.map noRangeDeclaration
                    |> Expect.equal
                        (Just <|
                            PortDeclaration
                                { operatorDefinition = False
                                , name = "scroll"
                                , typeReference =
                                    (FunctionTypeReference
                                        (FunctionTypeReference (Typed [] "Move" []) (GenericType "msg"))
                                        (Typed [] "Sub" ([ Generic "msg" ]))
                                    )
                                }
                        )
        , test "Destructuring declaration" <|
            \() ->
                parseFullStringWithNullState "_ = b" declaration
                    |> Maybe.map noRangeDeclaration
                    |> Expect.equal
                        (Just <|
                            DestructuringDeclaration
                                { pattern = AllPattern
                                , expression = emptyRanged <| (FunctionOrValue "b")
                                }
                        )
        , test "declaration" <|
            \() ->
                parseFullStringState emptyState "main =\n  text \"Hello, World!\"" Parser.functionDeclaration
                    |> Maybe.map noRangeFunctionDeclaration
                    |> Expect.equal
                        (Just
                            { operatorDefinition = False
                            , name = { value = "main", range = emptyRange }
                            , arguments = []
                            , expression =
                                emptyRanged <|
                                    Application
                                        ([ emptyRanged <| FunctionOrValue "text"
                                         , emptyRanged <| Literal "Hello, World!"
                                         ]
                                        )
                            }
                        )
        , test "function" <|
            \() ->
                parseFullStringState emptyState "main =\n  text \"Hello, World!\"" Parser.function
                    |> Maybe.map noRangeFunction
                    |> Expect.equal
                        (Just
                            { documentation = Nothing
                            , signature = Nothing
                            , declaration =
                                { operatorDefinition = False
                                , name =
                                    { value = "main"
                                    , range = emptyRange
                                    }
                                , arguments = []
                                , expression =
                                    emptyRanged <|
                                        Application
                                            ([ emptyRanged <| FunctionOrValue "text"
                                             , emptyRanged <| Literal "Hello, World!"
                                             ]
                                            )
                                }
                            }
                        )
        ]


moduleAndImport : Parser Types.State Types.Import
moduleAndImport =
    (moduleDefinition *> exactIndentWhitespace *> importDefinition)
