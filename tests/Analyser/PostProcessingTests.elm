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
                                    , name = { value = "bar", range = { start = { row = 3, column = -1 }, end = { row = 3, column = 2 } } }
                                    , arguments = []
                                    , expression =
                                        OperatorApplicationExpression
                                            { operator = "*"
                                            , direction = Left
                                            , left =
                                                (ParenthesizedExpression
                                                    { expression = (OperatorApplicationExpression { operator = "+", direction = Left, left = (FunctionOrValue "x"), right = (Integer 1) })
                                                    , range = { start = { row = 3, column = 5 }, end = { row = 3, column = 12 } }
                                                    }
                                                )
                                            , right =
                                                (ParenthesizedExpression
                                                    { expression = (OperatorApplicationExpression { operator = "*", direction = Left, left = (Integer 2), right = (FunctionOrValue "y") })
                                                    , range = { start = { row = 3, column = 15 }, end = { row = 5, column = -1 } }
                                                    }
                                                )
                                            }
                                    }
                                }
                            )
                        )
        ]
