module Analyser.Checks.UnnecessaryParensTests exposing (all)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.UnnecessaryParens as UnnecessaryParens
import Analyser.Messages.Data as Data exposing (MessageData)
import Test exposing (Test)


parensBetweenOperators : ( String, String, List MessageData )
parensBetweenOperators =
    ( "parensBetweenOperators"
    , """module Bar exposing (..)

foo =
  "a" ++ (f x y) ++ "b"
"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 4, column = 10 }, end = { row = 4, column = 17 } }
      ]
    )


parensAroundCaseStatement : ( String, String, List MessageData )
parensAroundCaseStatement =
    ( "parensAroundCaseStatement"
    , """module Bar exposing (..)

foo =
  (case x of
      Y -> f
  )
    k
"""
    , []
    )


parensForInfixCombinations : ( String, String, List MessageData )
parensForInfixCombinations =
    ( "parensForInfixCombinations"
    , """module Bar exposing (..)

foo =
  y * (x + z)
"""
    , []
    )


parensAroundSimpleValue : ( String, String, List MessageData )
parensAroundSimpleValue =
    ( "parensAroundSimpleValue"
    , """module Bar exposing (..)

foo = (1)

bar = ('c')

baz = (7.0)

john = ("John")

jon = (john)
"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 11, column = 7 }, end = { row = 11, column = 13 } }
      , Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 9, column = 8 }, end = { row = 9, column = 16 } }
      , Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 7, column = 7 }, end = { row = 7, column = 12 } }
      , Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 5, column = 7 }, end = { row = 5, column = 12 } }
      , Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 3, column = 7 }, end = { row = 3, column = 10 } }
      ]
    )


parensInOperatorForSimpleValue : ( String, String, List MessageData )
parensInOperatorForSimpleValue =
    ( "parensInOperatorForSimpleValue"
    , """module Bar exposing (..)

foo = 1 + (1)

"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 3, column = 11 }, end = { row = 3, column = 14 } }
      ]
    )


parensOnFirstPartOfApplication : ( String, String, List MessageData )
parensOnFirstPartOfApplication =
    ( "parensOnFirstPartOfApplication"
    , """module Bar exposing (..)

foo = (x y) z

"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 3, column = 7 }, end = { row = 3, column = 12 } }
      ]
    )


parensOnFirstPartOfApplicationWithOperator : ( String, String, List MessageData )
parensOnFirstPartOfApplicationWithOperator =
    ( "parensOnFirstPartOfApplicationWithOperator"
    , """module Bar exposing (..)

foo = (x |> y z ) a b c

"""
    , []
    )


allowParensForLambdaOnLhs : ( String, String, List MessageData )
allowParensForLambdaOnLhs =
    ( "allowParensForLambdaOnLhs"
    , """module Bar exposing (..)

foo = (\\x -> x + 1) <| 2

"""
    , []
    )


parensInCaseClause : ( String, String, List MessageData )
parensInCaseClause =
    ( "parensInCaseClause"
    , """module Bar exposing (..)

foo x =
  case (x 1) of
    True -> 2
    False -> 3

"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 4, column = 8 }, end = { row = 4, column = 13 } }
      ]
    )


parensInIfClause : ( String, String, List MessageData )
parensInIfClause =
    ( "parensInIfClause"
    , """module Bar exposing (..)

foo x =
  if (x 1) then
    (f x)
  else
    (g x)
"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 4, column = 6 }, end = { row = 4, column = 11 } }
      , Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 5, column = 5 }, end = { row = 5, column = 10 } }
      , Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 7, column = 5 }, end = { row = 7, column = 10 } }
      ]
    )


parensAroundListExpression : ( String, String, List MessageData )
parensAroundListExpression =
    ( "parensAroundListExpression"
    , """module Bar exposing (..)

foo x = ([x])
"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 3, column = 9 }, end = { row = 3, column = 14 } }
      ]
    )


parensInListExpression : ( String, String, List MessageData )
parensInListExpression =
    ( "parensInListExpression"
    , """module Bar exposing (..)

foo x = [ (x 1) ]
"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 3, column = 11 }, end = { row = 3, column = 16 } }
      ]
    )


parensAroundTupleExpression : ( String, String, List MessageData )
parensAroundTupleExpression =
    ( "parensAroundTupleExpression"
    , """module Bar exposing (..)

foo x = ((x, 1))
"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 3, column = 9 }, end = { row = 3, column = 17 } }
      ]
    )


parensAroundRecordExpression : ( String, String, List MessageData )
parensAroundRecordExpression =
    ( "parensAroundRecordExpression"
    , """module Bar exposing (..)

foo x = ({name = x})
"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 3, column = 9 }, end = { row = 3, column = 21 } }
      ]
    )


parensAroundRecordUpdateExpression : ( String, String, List MessageData )
parensAroundRecordUpdateExpression =
    ( "parensAroundRecordUpdateExpression"
    , """module Bar exposing (..)

foo x = ({ x | name = "Foo"})
"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 3, column = 9 }, end = { row = 3, column = 30 } }
      ]
    )


parensInRecordFieldValues : ( String, String, List MessageData )
parensInRecordFieldValues =
    ( "parensInRecordFieldValues"
    , """module Bar exposing (..)

foo =
  { bar = (x y)
  }
"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 4, column = 11 }, end = { row = 4, column = 16 } }
      ]
    )


parensInRecordFieldValuesForUpdate : ( String, String, List MessageData )
parensInRecordFieldValuesForUpdate =
    ( "parensInRecordFieldValuesForUpdate"
    , """module Bar exposing (..)

foo =
  { a
    | bar = (x y)
  }
"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 5, column = 13 }, end = { row = 5, column = 18 } }
      ]
    )


parensAroundRecordAccess : ( String, String, List MessageData )
parensAroundRecordAccess =
    ( "parensAroundRecordAccess"
    , """module Bar exposing (..)

foo x = (x.name.first)
"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 3, column = 9 }, end = { row = 3, column = 23 } }
      ]
    )


parensAroundRecordFunction : ( String, String, List MessageData )
parensAroundRecordFunction =
    ( "parensAroundRecordFunction"
    , """module Bar exposing (..)

foo x = List.map (.name) x
"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 3, column = 18 }, end = { row = 3, column = 25 } }
      ]
    )


parensFirstArgumentApplicationWithRecordAccess : ( String, String, List MessageData )
parensFirstArgumentApplicationWithRecordAccess =
    ( "parensFirstArgumentApplicationWithRecordAccess"
    , """module Bar exposing (..)

foo = (Tuple.first newFileContent).sha1
"""
    , []
    )


allowParensForIfStatementOnLHS : ( String, String, List MessageData )
allowParensForIfStatementOnLHS =
    ( "allowParensForIfStatementOnLHS"
    , """module Bar exposing (..)

foo =
  (if x then
     1
   else
     2
  ) |> toString
"""
    , []
    )


allowParensForCaseOnLHS : ( String, String, List MessageData )
allowParensForCaseOnLHS =
    ( "allowParensForCaseOnLHS"
    , """module Bar exposing (..)

foo =
  (case x of
     True -> 1
     False -> 2
  ) |> toString
"""
    , []
    )


parensAroundTopLevelApplication : ( String, String, List MessageData )
parensAroundTopLevelApplication =
    ( "parensAroundTopLevelApplication"
    , """module Bar exposing (..)

foo =
    (f a b)
"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 4, column = 5 }, end = { row = 4, column = 12 } }
      ]
    )


parensInTuple : ( String, String, List MessageData )
parensInTuple =
    ( "parensInTuple"
    , """module Bar exposing (..)

foo = ( ("price"), (Location 0 0) )
"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 3, column = 9 }, end = { row = 3, column = 18 } }
      , Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 3, column = 20 }, end = { row = 3, column = 34 } }
      ]
    )


parensInLambdaExpressionWithQualifiedExpression : ( String, String, List MessageData )
parensInLambdaExpressionWithQualifiedExpression =
    ( "parensInLambdaExpressionWithQualifiedExpression"
    , """module Bar exposing (..)

foo =
    bar
        (\\() ->
            (String.concat)
        )
"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 6, column = 13 }, end = { row = 6, column = 28 } }
      ]
    )


parensInLambdaExpressionWithQualifiedExpressionWithArgs : ( String, String, List MessageData )
parensInLambdaExpressionWithQualifiedExpressionWithArgs =
    ( "parensInLambdaExpressionWithQualifiedExpressionWithArgs"
    , """module Bar exposing (..)

foo =
    bar
        (\\() ->
            (String.concat 1)
        )
"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 6, column = 13 }, end = { row = 6, column = 30 } }
      ]
    )


parensAroundApplicationWithNegatedArg : ( String, String, List MessageData )
parensAroundApplicationWithNegatedArg =
    ( "parensAroundApplicationWithNegatedArg"
    , """module Bar exposing (..)

foo =
    (toFloat -5) / 2
"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 4, column = 5 }, end = { row = 4, column = 17 } }
      ]
    )


negatedApplicationWithParens : ( String, String, List MessageData )
negatedApplicationWithParens =
    ( "negatedApplicationWithParens"
    , """module Bar exposing (..)

foo =
    toFloat -(bar baz) / 2

"""
    , []
    )


{-| Introduced for #98. Bump elm-format to 0.7.0. This version will place parens around statements lhs/rhs of oprator application.
-}
parensAroundCaseOnOperatorSide : ( String, String, List MessageData )
parensAroundCaseOnOperatorSide =
    ( "parensAroundCaseOnOperatorSide"
    , """module Bar exposing (..)

foo x =
    1 + (case x of
            True -> 2
            Fasle -> 3
        )

"""
    , []
    )


{-| Introduced for #98. Bump elm-format to 0.7.0. This version will place parens around statements lhs/rhs of oprator application.
-}
firstParamALambda : ( String, String, List MessageData )
firstParamALambda =
    ( "firstParamALambda"
    , """module Bar exposing (..)

foo =
  A (\\() -> (\\(B c) -> c) d)
"""
    , []
    )


all : Test
all =
    CTU.build "Analyser.Checks.UnnecessaryParens"
        UnnecessaryParens.checker
        [ parensBetweenOperators
        , parensForInfixCombinations
        , parensAroundSimpleValue
        , parensInOperatorForSimpleValue
        , parensOnFirstPartOfApplication
        , parensOnFirstPartOfApplicationWithOperator
        , allowParensForLambdaOnLhs
        , parensInCaseClause
        , parensInIfClause
        , parensAroundListExpression
        , parensInListExpression
        , parensAroundTupleExpression
        , parensAroundRecordUpdateExpression
        , parensInRecordFieldValues
        , parensInRecordFieldValuesForUpdate
        , parensAroundRecordAccess
        , parensAroundRecordFunction
        , parensFirstArgumentApplicationWithRecordAccess
        , allowParensForIfStatementOnLHS
        , allowParensForCaseOnLHS
        , parensAroundTopLevelApplication
        , parensInTuple
        , parensInLambdaExpressionWithQualifiedExpression
        , parensInLambdaExpressionWithQualifiedExpressionWithArgs
        , parensAroundApplicationWithNegatedArg
        , negatedApplicationWithParens
        , parensAroundCaseOnOperatorSide
        , parensAroundCaseStatement
        , firstParamALambda
        ]
