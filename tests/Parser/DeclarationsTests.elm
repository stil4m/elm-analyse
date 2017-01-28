module Parser.DeclarationsTests exposing (..)

import Combine exposing ((*>), Parser)
import Parser.CombineTestUtil exposing (..)
import Expect
import Parser.Declarations as Parser exposing (..)
import Parser.Imports exposing (importDefinition)
import Parser.Modules exposing (moduleDefinition)
import AST.Types as Types exposing (..)
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
                    |> Expect.equal (Just { operatorDefinition = False, name = "foo", arguments = [], expression = (FunctionOrValue "bar") })
        , test "operator declarations" <|
            \() ->
                parseFullStringWithNullState "(&>) = flip Maybe.andThen" Parser.functionDeclaration
                    |> Expect.equal
                        (Just
                            { operatorDefinition = True
                            , name = "&>"
                            , arguments = []
                            , expression =
                                (Application
                                    [ FunctionOrValue "flip"
                                    , QualifiedExpr [ "Maybe" ] "andThen"
                                    ]
                                )
                            }
                        )
        , test "function declaration with args" <|
            \() ->
                parseFullStringWithNullState "inc x = x + 1" Parser.functionDeclaration
                    |> Expect.equal
                        (Just { operatorDefinition = False, name = "inc", arguments = [ VarPattern { value = "x", range = { start = { row = 1, column = 4 }, end = { row = 1, column = 5 } } } ], expression = Application ([ FunctionOrValue "x", Operator "+", Integer 1 ]) })
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
                    |> Expect.equal
                        (Just
                            { operatorDefinition = False
                            , name = "foo"
                            , arguments = []
                            , expression =
                                (LetExpression
                                    { declarations =
                                        [ FuncDecl
                                            { documentation = Nothing
                                            , signature = Nothing
                                            , declaration =
                                                { operatorDefinition = False
                                                , name = "b"
                                                , arguments = []
                                                , expression = Integer 1
                                                }
                                            }
                                        ]
                                    , expression = (FunctionOrValue "b")
                                    }
                                )
                            }
                        )
        , test "declaration with record" <|
            \() ->
                parseFullStringWithNullState "main =\n  beginnerProgram { model = 0, view = view, update = update }" Parser.functionDeclaration
                    |> Expect.equal
                        (Just
                            { operatorDefinition = False
                            , name = "main"
                            , arguments = []
                            , expression =
                                (Application
                                    [ FunctionOrValue "beginnerProgram"
                                    , RecordExpr
                                        [ ( "model", Integer 0 )
                                        , ( "view", FunctionOrValue "view" )
                                        , ( "update", FunctionOrValue "update" )
                                        ]
                                    ]
                                )
                            }
                        )
        , test "update function" <|
            \() ->
                parseFullStringWithNullState "update msg model =\n  case msg of\n    Increment ->\n      model + 1\n\n    Decrement ->\n      model - 1" Parser.functionDeclaration
                    |> Expect.equal
                        (Just
                            { operatorDefinition = False
                            , name = "update"
                            , arguments = [ VarPattern { value = "msg", range = { start = { row = 1, column = 7 }, end = { row = 1, column = 10 } } }, VarPattern { value = "model", range = { start = { row = 1, column = 11 }, end = { row = 1, column = 16 } } } ]
                            , expression =
                                CaseExpression
                                    { expression = FunctionOrValue "msg"
                                    , cases =
                                        [ ( NamedPattern (QualifiedNameRef [] "Increment") []
                                          , Application ([ FunctionOrValue "model", Operator "+", Integer 1 ])
                                          )
                                        , ( NamedPattern (QualifiedNameRef [] "Decrement") []
                                          , Application
                                                ([ FunctionOrValue "model"
                                                 , Operator "-"
                                                 , Integer 1
                                                 ]
                                                )
                                          )
                                        ]
                                    }
                            }
                        )
        , test "port declaration" <|
            \() ->
                parseFullStringWithNullState "port parseResponse : ( String, String ) -> Cmd msg" Parser.portDeclaration
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
                    |> Expect.equal
                        (Just
                            { moduleDefinition =
                                NoModule
                            , imports =
                                [ { moduleName = [ "Html" ]
                                  , moduleAlias = Nothing
                                  , exposingList = Types.None
                                  }
                                ]
                            , declarations = []
                            }
                        )
        , test "port declaration" <|
            \() ->
                parseFullStringWithNullState "port scroll : (Move -> msg) -> Sub msg" declaration
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
                parseFullStringWithNullState "_ = b" destructuringDeclaration
                    |> Expect.equal
                        (Just <| Destructuring AllPattern (FunctionOrValue "b"))
        ]


moduleAndImport : Parser Types.State Types.Import
moduleAndImport =
    (moduleDefinition *> exactIndentWhitespace *> importDefinition)
