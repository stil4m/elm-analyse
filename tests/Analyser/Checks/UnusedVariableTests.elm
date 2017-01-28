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
    """module Bar

bar x y z = x + z
"""


all : Test
all =
    describe "Analyser.PostProcessingTests"
        [ test "foo" <|
            \() ->
                Parser.Parser.parse withUnusedVariableInFunction
                    |> Maybe.map (\file -> ( "./foo.elm", Loaded { interface = Interface.build file, ast = file, moduleName = AST.Util.fileModuleName file } ))
                    |> Maybe.andThen (\file -> FileContext.create [ file ] [] file)
                    |> Maybe.map UnusedVariable.scan
                    |> Expect.equal
                        (Just
                            [ Warning (UnusedVariable "./foo.elm" "y" { start = { row = 2, column = 5 }, end = { row = 2, column = 6 } }) ]
                        )
        ]
