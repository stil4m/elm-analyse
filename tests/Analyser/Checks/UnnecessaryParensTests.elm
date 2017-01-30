module Analyser.Checks.UnnecessaryParensTests exposing (..)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.UnnecessaryParens as UnnecessaryParens
import Analyser.Messages exposing (..)
import Expect
import Test exposing (..)


parensBetweenOperators : ( String, String, List Message )
parensBetweenOperators =
    ( "parensBetweenOperators"
    , """module Bar exposing (..)

foo =
  "a" ++ (f x y) ++ "b"
"""
    , [ UnnecessaryParens "./foo.elm" { start = { row = 3, column = 8 }, end = { row = 3, column = 15 } }
      ]
    )


parensForInfixCombinations : ( String, String, List Message )
parensForInfixCombinations =
    ( "parensForInfixCombinations"
    , """module Bar exposing (..)

foo =
  y * (x + z)
"""
    , []
    )


parensAroundSimpleValue : ( String, String, List Message )
parensAroundSimpleValue =
    ( "parensAroundSimpleValue"
    , """module Bar exposing (..)

foo = (1)

bar = ('c')

baz = (7.0)

john = ("John")

jon = (john)
"""
    , [ UnnecessaryParens "./foo.elm" { start = { row = 10, column = 5 }, end = { row = 12, column = -1 } }
      , UnnecessaryParens "./foo.elm" { start = { row = 8, column = 6 }, end = { row = 9, column = -2 } }
      , UnnecessaryParens "./foo.elm" { start = { row = 6, column = 5 }, end = { row = 7, column = -2 } }
      , UnnecessaryParens "./foo.elm" { start = { row = 4, column = 5 }, end = { row = 5, column = -2 } }
      , UnnecessaryParens "./foo.elm" { start = { row = 2, column = 5 }, end = { row = 3, column = -2 } }
      ]
    )


parensInOperatorForSimpleValue : ( String, String, List Message )
parensInOperatorForSimpleValue =
    ( "parensInOperatorForSimpleValue"
    , """module Bar exposing (..)

foo = 1 + (1)

"""
    , [ UnnecessaryParens "./foo.elm" { start = { row = 2, column = 9 }, end = { row = 3, column = -2 } }
      ]
    )


parensOnFirstPartOfApplication : ( String, String, List Message )
parensOnFirstPartOfApplication =
    ( "parensOnFirstPartOfApplication"
    , """module Bar exposing (..)

foo = (x y) z

"""
    , [ UnnecessaryParens "./foo.elm" { start = { row = 2, column = 5 }, end = { row = 2, column = 10 } }
      ]
    )


parensOnFirstPartOfApplicationWithOperator : ( String, String, List Message )
parensOnFirstPartOfApplicationWithOperator =
    ( "parensOnFirstPartOfApplicationWithOperator"
    , """module Bar exposing (..)

foo = (x |> y z ) a b c

"""
    , []
    )


allowParensForLambdaOnLhs : ( String, String, List Message )
allowParensForLambdaOnLhs =
    ( "allowParensForLambdaOnLhs"
    , """module Bar exposing (..)

foo = (\\x -> x + 1) <| 2

"""
    , []
    )


parensInCaseClause : ( String, String, List Message )
parensInCaseClause =
    ( "parensInCaseClause"
    , """module Bar exposing (..)

foo x =
  case (x 1) of
    True -> 2
    False -> 3

"""
    , [ UnnecessaryParens "./foo.elm" { start = { row = 3, column = 6 }, end = { row = 3, column = 11 } } ]
    )


parensInIfClause : ( String, String, List Message )
parensInIfClause =
    ( "parensInIfClause"
    , """module Bar exposing (..)

foo x =
  if (x 1) then
    (f x)
  else
    (g x)
"""
    , [ UnnecessaryParens "./foo.elm" { start = { row = 3, column = 4 }, end = { row = 3, column = 9 } }
      , UnnecessaryParens "./foo.elm" { start = { row = 4, column = 3 }, end = { row = 5, column = -2 } }
      , UnnecessaryParens "./foo.elm" { start = { row = 6, column = 3 }, end = { row = 8, column = -1 } }
      ]
    )


parensAroundListExpression : ( String, String, List Message )
parensAroundListExpression =
    ( "parensAroundListExpression"
    , """module Bar exposing (..)

foo x = ([x])
"""
    , [ UnnecessaryParens "./foo.elm" { start = { row = 2, column = 7 }, end = { row = 4, column = -1 } }
      ]
    )


parensInRecordFieldValues : ( String, String, List Message )
parensInRecordFieldValues =
    ( "parensInRecordFieldValues"
    , """module Bar exposing (..)

foo =
  { bar = (x y)
  }
"""
    , [ UnnecessaryParens "./foo.elm" { start = { row = 2, column = 5 }, end = { row = 2, column = 10 } }
      ]
    )


all : Test
all =
    describe "Analyser.Checks.UnnecessaryParensTests"
        ([ parensBetweenOperators
         , parensForInfixCombinations
         , parensAroundSimpleValue
         , parensInOperatorForSimpleValue
         , parensOnFirstPartOfApplication
         , parensOnFirstPartOfApplicationWithOperator
         , allowParensForLambdaOnLhs
         , parensInCaseClause
         , parensInIfClause
         , parensAroundListExpression
         ]
            |> List.map
                (\( name, input, messages ) ->
                    test name <|
                        \() ->
                            CTU.getMessages input UnnecessaryParens.scan
                                |> Expect.equal
                                    (Just messages)
                )
        )
