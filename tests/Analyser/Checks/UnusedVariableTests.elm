module Analyser.Checks.UnusedVariableTests exposing (..)

import AST.Util
import Analyser.FileContext as FileContext
import Analyser.Checks.UnusedVariable as UnusedVariable
import Interfaces.Interface as Interface
import Analyser.Types exposing (..)
import Dict exposing (Dict)
import Expect
import Parser.Parser
import Test exposing (..)
import Analyser.Messages exposing (..)


table : OperatorTable
table =
    Dict.fromList []


withUnusedVariableInFunction : String
withUnusedVariableInFunction =
    """module Bar exposing (..)

bar x y z = x + z
"""


unusedInLetExpression : String
unusedInLetExpression =
    """module Bar exposing (..)

x =
  let
    y = 1
  in
    2
"""


unusedFunction : String
unusedFunction =
    """module Bar exposing (foo)

foo = some

baz = 2

some = 1
"""


usedVariableAsRecordUpdate : String
usedVariableAsRecordUpdate =
    """module Bar exposing (..)

addUsedVariable x =
    { x | name = "John" }

"""


usedVariableInCaseExpression : String
usedVariableInCaseExpression =
    """module Bar exposing (..)

foo x =
    case x of
      Bar -> 1

"""


usedVariableInAllDeclaration : String
usedVariableInAllDeclaration =
    """module Bar exposing (..)

x y =
  case y of
   ( b, _ ) ->
    let
        _ =
            Debug.log "Unknown" b
    in
        model ! []"""


getMessages : String -> Maybe (List Message)
getMessages input =
    Parser.Parser.parse input
        -- |> Debug.log "File"
        |>
            Maybe.map (\file -> ( "./foo.elm", Loaded { interface = Interface.build file, ast = file, moduleName = AST.Util.fileModuleName file } ))
        |> Maybe.andThen (\file -> FileContext.create [ file ] [] file)
        |> Maybe.map UnusedVariable.scan


all : Test
all =
    describe "Analyser.PostProcessingTests"
        [ test "withUnusedVariableInFunction" <|
            \() ->
                getMessages withUnusedVariableInFunction
                    |> Expect.equal
                        (Just
                            [ (UnusedVariable "./foo.elm" "y" { start = { row = 2, column = 5 }, end = { row = 2, column = 6 } }) ]
                        )
        , test "unusedInLetExpression" <|
            \() ->
                getMessages unusedInLetExpression
                    |> Expect.equal (Just ([ (UnusedVariable "./foo.elm" "y" { start = { row = 4, column = 3 }, end = { row = 4, column = 4 } }) ]))
        , test "unusedFunction" <|
            \() ->
                getMessages unusedFunction
                    |> Expect.equal (Just ([ UnusedTopLevel "./foo.elm" "baz" { start = { row = 4, column = -1 }, end = { row = 4, column = 2 } } ]))
        , test "usedVariableAsRecordUpdate" <|
            \() -> getMessages usedVariableAsRecordUpdate |> Expect.equal (Just [])
        , test "usedVariableInCaseExpression" <|
            \() -> getMessages usedVariableInCaseExpression |> Expect.equal (Just [])
        , test "usedVariableInAllDeclaration" <|
            \() -> getMessages usedVariableInAllDeclaration |> Expect.equal (Just [])
        ]
