module Analyser.Checks.UnnecessaryParensTests exposing (..)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.UnnecessaryParens as UnnecessaryParens
import Analyser.Messages.Types exposing (..)
import Test exposing (Test)


parensBetweenOperators : ( String, String, List MessageData )
parensBetweenOperators =
    ( "parensBetweenOperators"
    , """module Bar exposing (..)

foo =
  "a" ++ (f x y) ++ "b"
"""
    , [ UnnecessaryParens "./foo.elm" { start = { row = 3, column = 8 }, end = { row = 3, column = 15 } }
      ]
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
    , [ UnnecessaryParens "./foo.elm" { start = { row = 10, column = 5 }, end = { row = 12, column = -1 } }
      , UnnecessaryParens "./foo.elm" { start = { row = 8, column = 6 }, end = { row = 9, column = -2 } }
      , UnnecessaryParens "./foo.elm" { start = { row = 6, column = 5 }, end = { row = 7, column = -2 } }
      , UnnecessaryParens "./foo.elm" { start = { row = 4, column = 5 }, end = { row = 5, column = -2 } }
      , UnnecessaryParens "./foo.elm" { start = { row = 2, column = 5 }, end = { row = 3, column = -2 } }
      ]
    )


parensInOperatorForSimpleValue : ( String, String, List MessageData )
parensInOperatorForSimpleValue =
    ( "parensInOperatorForSimpleValue"
    , """module Bar exposing (..)

foo = 1 + (1)

"""
    , [ UnnecessaryParens "./foo.elm" { start = { row = 2, column = 9 }, end = { row = 3, column = -2 } }
      ]
    )


parensOnFirstPartOfApplication : ( String, String, List MessageData )
parensOnFirstPartOfApplication =
    ( "parensOnFirstPartOfApplication"
    , """module Bar exposing (..)

foo = (x y) z

"""
    , [ UnnecessaryParens "./foo.elm" { start = { row = 2, column = 5 }, end = { row = 2, column = 10 } }
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
    , [ UnnecessaryParens "./foo.elm" { start = { row = 3, column = 6 }, end = { row = 3, column = 11 } } ]
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
    , [ UnnecessaryParens "./foo.elm" { start = { row = 3, column = 4 }, end = { row = 3, column = 9 } }
      , UnnecessaryParens "./foo.elm" { start = { row = 4, column = 3 }, end = { row = 5, column = -2 } }
      , UnnecessaryParens "./foo.elm" { start = { row = 6, column = 3 }, end = { row = 8, column = -1 } }
      ]
    )


parensAroundListExpression : ( String, String, List MessageData )
parensAroundListExpression =
    ( "parensAroundListExpression"
    , """module Bar exposing (..)

foo x = ([x])
"""
    , [ UnnecessaryParens "./foo.elm" { start = { row = 2, column = 7 }, end = { row = 4, column = -1 } }
      ]
    )


parensAroundTupleExpression : ( String, String, List MessageData )
parensAroundTupleExpression =
    ( "parensAroundTupleExpression"
    , """module Bar exposing (..)

foo x = ((x, 1))
"""
    , [ UnnecessaryParens "./foo.elm" { start = { row = 2, column = 7 }, end = { row = 4, column = -1 } }
      ]
    )


parensAroundRecordExpression : ( String, String, List MessageData )
parensAroundRecordExpression =
    ( "parensAroundTupleExpression"
    , """module Bar exposing (..)

foo x = ({name = x})
"""
    , [ UnnecessaryParens "./foo.elm" { start = { row = 2, column = 7 }, end = { row = 4, column = -1 } }
      ]
    )


parensAroundRecordUpdateExpression : ( String, String, List MessageData )
parensAroundRecordUpdateExpression =
    ( "parensAroundTupleExpression"
    , """module Bar exposing (..)

foo x = ({ x | name = "Foo"})
"""
    , [ UnnecessaryParens "./foo.elm" { start = { row = 2, column = 7 }, end = { row = 4, column = -1 } }
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
    , [ UnnecessaryParens "./foo.elm" { start = { row = 3, column = 9 }, end = { row = 4, column = -2 } }
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
    , [ UnnecessaryParens "./foo.elm" { start = { row = 4, column = 11 }, end = { row = 5, column = -2 } }
      ]
    )


parensAroundRecordAccess : ( String, String, List MessageData )
parensAroundRecordAccess =
    ( "parensAroundRecordAccess"
    , """module Bar exposing (..)

foo x = (x.name.first)
"""
    , [ UnnecessaryParens "./foo.elm" { start = { row = 2, column = 7 }, end = { row = 4, column = -1 } }
      ]
    )


parensAroundRecordFunction : ( String, String, List MessageData )
parensAroundRecordFunction =
    ( "parensAroundRecordFunction"
    , """module Bar exposing (..)

foo x = List.map (.name) x
"""
    , [ UnnecessaryParens "./foo.elm" { start = { row = 2, column = 16 }, end = { row = 2, column = 23 } }
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
    , [ UnnecessaryParens "./foo.elm" { start = { row = 3, column = 3 }, end = { row = 5, column = -1 } }
      ]
    )


parensInTuple : ( String, String, List MessageData )
parensInTuple =
    ( "parensInTuple"
    , """module Bar exposing (..)

foo = ( ("price"), (Location 0 0) )
"""
    , [ UnnecessaryParens "./foo.elm" { start = { row = 2, column = 7 }, end = { row = 2, column = 16 } }
      , UnnecessaryParens "./foo.elm" { start = { row = 2, column = 18 }, end = { row = 2, column = 32 } }
      ]
    )


all : Test
all =
    CTU.build "Analyser.Checks.UnnecessaryParensTests"
        UnnecessaryParens.scan
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
        , parensAroundTupleExpression
        , parensAroundRecordUpdateExpression
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
        ]
