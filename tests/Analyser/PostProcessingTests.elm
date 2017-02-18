module Analyser.PostProcessingTests exposing (..)

import AST.Ranges exposing (emptyRange)
import AST.Types exposing (..)
import Analyser.PostProcessing as PostProcessing
import Analyser.Files.Types exposing (..)
import Dict exposing (Dict)
import Expect
import Parser.CombineTestUtil exposing (noRangeDeclaration)
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
        [ test "post processing" <|
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
                                    , name = { value = "bar", range = emptyRange }
                                    , arguments = []
                                    , expression =
                                        ( emptyRange
                                        , OperatorApplication
                                            "*"
                                            Left
                                            ( emptyRange
                                            , ParenthesizedExpression
                                                ( emptyRange
                                                , OperatorApplication "+"
                                                    Left
                                                    ( emptyRange, FunctionOrValue "x" )
                                                    ( emptyRange, Integer 1 )
                                                )
                                            )
                                            ( emptyRange
                                            , ParenthesizedExpression
                                                ( emptyRange
                                                , OperatorApplication "*"
                                                    Left
                                                    ( emptyRange, Integer 2 )
                                                    ( emptyRange, FunctionOrValue "y" )
                                                )
                                            )
                                        )
                                    }
                                }
                            )
                        )
        ]
