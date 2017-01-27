module Analyser.PostProcessingTests exposing (..)

import Analyser.PostProcessing as PostProcessing
import Analyser.Types exposing (..)
import Dict exposing (Dict)
import Expect
import Parser.Parser
import Test exposing (..)
import AST.Types exposing (..)


table : OperatorTable
table =
    Dict.fromList []


someInput : String
someInput =
    """
module Bar

bar = (x + 1) * (2 * y)
"""


all : Test
all =
    describe "Analyser.PostProcessingTests"
        [ test "foo" <|
            \() ->
                Parser.Parser.parse someInput
                    |> Maybe.map (PostProcessing.postProcess table)
                    |> Maybe.map .declarations
                    |> Maybe.andThen List.head
                    |> Expect.equal
                        (Just
                            (FuncDecl
                                { documentation = Nothing
                                , signature = Nothing
                                , declaration =
                                    { operatorDefinition = False
                                    , name = "bar"
                                    , arguments = []
                                    , expression =
                                        OperatorApplication Left
                                            (Parentesized (OperatorApplication Left (FunctionOrValue "x") (Integer 1)))
                                            (Parentesized (OperatorApplication Left (Integer 2) (FunctionOrValue "y")))
                                    }
                                }
                            )
                        )
        ]
