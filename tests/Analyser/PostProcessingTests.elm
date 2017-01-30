module Analyser.PostProcessingTests exposing (..)

import AST.Ranges exposing (emptyRange)
import AST.Types exposing (..)
import Analyser.PostProcessing as PostProcessing
import Analyser.Types exposing (..)
import Dict exposing (Dict)
import Expect
import Parser.CombineTestUtil exposing (noRangeDeclaration, noRangeExpression)
import Parser.Parser
import Test exposing (..)


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
                    |> Maybe.map (List.map noRangeDeclaration)
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
                                        ( emptyRange
                                        , OperatorApplicationExpression
                                            { operator = "*"
                                            , direction = Left
                                            , left =
                                                ( emptyRange
                                                , ParenthesizedExpression
                                                    ( emptyRange
                                                    , (OperatorApplicationExpression
                                                        { operator = "+"
                                                        , direction = Left
                                                        , left = ( emptyRange, FunctionOrValue "x" )
                                                        , right = ( emptyRange, Integer 1 )
                                                        }
                                                      )
                                                    )
                                                )
                                            , right =
                                                ( emptyRange
                                                , ParenthesizedExpression
                                                    ( emptyRange
                                                    , (OperatorApplicationExpression
                                                        { operator = "*"
                                                        , direction = Left
                                                        , left = ( emptyRange, Integer 2 )
                                                        , right = ( emptyRange, FunctionOrValue "y" )
                                                        }
                                                      )
                                                    )
                                                )
                                            }
                                        )
                                    }
                                }
                            )
                        )
        ]
