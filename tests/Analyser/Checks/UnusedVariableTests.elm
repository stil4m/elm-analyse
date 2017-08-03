module Analyser.Checks.UnusedVariableTests exposing (..)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.UnusedVariable as UnusedVariable
import Analyser.Files.Types exposing (..)
import Dict exposing (Dict)
import Test exposing (..)
import Analyser.Messages.Types exposing (..)
import Analyser.Checks.CheckTestUtil
import Analyser.Messages.Range as Range


table : OperatorTable
table =
    Dict.fromList []


withUnusedVariableInFunction : ( String, String, List MessageData )
withUnusedVariableInFunction =
    ( "withUnusedVariableInFunction"
    , """module Bar exposing (..)

bar x y z = x + z
"""
    , [ (UnusedVariable "./foo.elm" "y" <|
            Range.manual
                { start = { row = 2, column = 6 }, end = { row = 2, column = 7 } }
                { start = { row = 2, column = 5 }, end = { row = 2, column = 6 } }
        )
      ]
    )


unusedInLetExpression : ( String, String, List MessageData )
unusedInLetExpression =
    ( "unusedInLetExpression"
    , """module Bar exposing (..)

x =
  let
    y = 1
  in
    2
"""
    , [ (UnusedVariable "./foo.elm" "y" <|
            Range.manual
                { start = { row = 4, column = 4 }, end = { row = 4, column = 5 } }
                { start = { row = 4, column = 3 }, end = { row = 4, column = 4 } }
        )
      ]
    )


unusedFunction : ( String, String, List MessageData )
unusedFunction =
    ( "unusedFunction"
    , """module Bar exposing (foo)

foo = some

baz = 2

some = 1
"""
    , [ UnusedTopLevel "./foo.elm" "baz" <|
            Range.manual
                { start = { row = 4, column = 0 }, end = { row = 4, column = 3 } }
                { start = { row = 4, column = -1 }, end = { row = 4, column = 2 } }
      ]
    )


usedVariableAsRecordUpdate : ( String, String, List MessageData )
usedVariableAsRecordUpdate =
    ( "usedVariableAsRecordUpdate"
    , """module Bar exposing (..)

addUsedVariable x =
    { x | name = "John" }

"""
    , []
    )


usedVariableInCaseExpression : ( String, String, List MessageData )
usedVariableInCaseExpression =
    ( "usedVariableInCaseExpression"
    , """module Bar exposing (..)

foo x =
    case x of
      Bar -> 1

"""
    , []
    )


usedVariableInAllDeclaration : ( String, String, List MessageData )
usedVariableInAllDeclaration =
    ( "usedVariableInAllDeclaration"
    , """module Bar exposing (..)

x y =
  case y of
   ( b, _ ) ->
    let
        _ =
            Debug.log "Unknown" b
    in
        model ! []"""
    , []
    )


usedValueConstructor : ( String, String, List MessageData )
usedValueConstructor =
    ( "usedValueConstructor"
    , """module Bar exposing (foo)
type Some = Thing


foo = Thing
"""
    , []
    )


unusedValueConstructor : ( String, String, List MessageData )
unusedValueConstructor =
    ( "unusedValueConstructor"
    , """module Bar exposing (foo,Some(Thing))

type Some = Thing | Other

"""
    , [ UnusedTopLevel "./foo.elm" "Other" <|
            Range.manual
                { start = { row = 2, column = 20 }, end = { row = 2, column = 25 } }
                { start = { row = 2, column = 19 }, end = { row = 3, column = -2 } }
      ]
    )


exposedValueConstructor : ( String, String, List MessageData )
exposedValueConstructor =
    ( "exposedValueConstructor"
    , """module Bar exposing (foo,Some(Thing))
type Some = Thing


foo = 1
"""
    , []
    )


onlyUsedInSelf : ( String, String, List MessageData )
onlyUsedInSelf =
    ( "onlyUsedInSelf"
    , """module Bar exposing (foo,Some(Thing))
type Some = Thing

foo = 1

bar = bar + foo
"""
    , [ UnusedTopLevel "./foo.elm" "bar" <|
            Range.manual
                { start = { row = 5, column = 0 }, end = { row = 5, column = 3 } }
                { start = { row = 5, column = -1 }, end = { row = 5, column = 2 } }
      ]
    )


usedOperator : ( String, String, List MessageData )
usedOperator =
    ( "usedOperator"
    , """module Bar exposing (foo,Some(Thing))
type Some = Thing

(&>) _ b = b

foo =
    1 &> 2
"""
    , []
    )


unusedOperator : ( String, String, List MessageData )
unusedOperator =
    ( "unusedOperator"
    , """module Bar exposing (foo)

foo = 1

(&>) _ b = b

"""
    , [ UnusedTopLevel "./foo.elm" "&>" <|
            Range.manual
                { start = { row = 4, column = 0 }, end = { row = 4, column = 4 } }
                { start = { row = 4, column = -1 }, end = { row = 4, column = 3 } }
      ]
    )


unusedImportedOperator : ( String, String, List MessageData )
unusedImportedOperator =
    ( "unusedImportedOperator"
    , """module Bar exposing (foo)

import Foo exposing ((!!))

foo = 1

"""
    , [ UnusedImportedVariable "./foo.elm" "!!" <|
            Range.manual
                { start = { row = 2, column = 21 }, end = { row = 2, column = 25 } }
                { start = { row = 2, column = 20 }, end = { row = 2, column = 24 } }
      ]
    )


destructuringSameName : ( String, String, List MessageData )
destructuringSameName =
    ( "destructuringSameName"
    , """module Foo exposing (..)

error : Model -> Maybe Error
error { error } =
    error
"""
    , []
    )


unusedInEffectModule : ( String, String, List MessageData )
unusedInEffectModule =
    ( "unusedInEffectModule"
    , """effect module X where {subscription = MySub} exposing (foo)


foo = 1

init = 2
"""
    , []
    )


unusedImportedVariable : ( String, String, List MessageData )
unusedImportedVariable =
    ( "unusedImportedVariable"
    , """module Foo exposing (foo)

import Html exposing (div)

foo = 1
"""
    , [ UnusedImportedVariable "./foo.elm" "div" <|
            Range.manual
                { start = { row = 2, column = 22 }, end = { row = 2, column = 25 } }
                { start = { row = 2, column = 21 }, end = { row = 2, column = 24 } }
      ]
    )


usedImportedVariableInPatterMatch : ( String, String, List MessageData )
usedImportedVariableInPatterMatch =
    ( "usedImportedVariableInPatterMatch"
    , """module Foo exposing (foo)

import Color exposing (Color(Blue))

foo c =
  case c of
    Blue -> 1

"""
    , []
    )


usedImportedVariableAsOpaque : ( String, String, List MessageData )
usedImportedVariableAsOpaque =
    ( "usedImportedVariableAsOpaque"
    , """module Foo exposing (foo)

import Color exposing (Color(Blue))

foo (Blue c) =
  c
"""
    , []
    )


exposeOperator : ( String, String, List MessageData )
exposeOperator =
    ( "usedImportedVariableAsOpaque"
    , """module Foo exposing ((@@))


(@@) x y =
  (y,x)
"""
    , []
    )


unusedInCasePattern : ( String, String, List MessageData )
unusedInCasePattern =
    ( "unusedInCasePattern"
    , """module Foo exposing (foo)


foo x =
  case x of
    Just y ->
      1
"""
    , [ UnusedPatternVariable "./foo.elm" "y" <|
            Range.manual
                { start = { row = 5, column = 9 }, end = { row = 5, column = 10 } }
                { start = { row = 5, column = 8 }, end = { row = 5, column = 9 } }
      ]
    )


unusedInCasePatternAsSingle : ( String, String, List MessageData )
unusedInCasePatternAsSingle =
    ( "unusedInCasePatternAsSingle"
    , """module Foo exposing (foo)


foo x =
  case x of
    y ->
      1
"""
    , [ UnusedPatternVariable "./foo.elm" "y" <|
            Range.manual
                { start = { row = 5, column = 4 }, end = { row = 5, column = 5 } }
                { start = { row = 5, column = 3 }, end = { row = 5, column = 4 } }
      ]
    )


unusedButDestructuredWithSameNameInList : ( String, String, List MessageData )
unusedButDestructuredWithSameNameInList =
    ( "unusedButDestructuredWithSameNameInList"
    , """module Foo exposing (foo)

foo x y=
  case x of
    [y] ->
      y
"""
    , [ UnusedVariable "./foo.elm" "y" <|
            Range.manual
                { start = { row = 2, column = 6 }, end = { row = 2, column = 7 } }
                { start = { row = 2, column = 5 }, end = { row = 2, column = 6 } }
      ]
    )


unusedButDestructuredWithSameNameInTuple : ( String, String, List MessageData )
unusedButDestructuredWithSameNameInTuple =
    ( "unusedButDestructuredWithSameNameInTuple"
    , """module Foo exposing (foo)

foo x y=
  case x of
    (y,_) ->
      y
"""
    , [ UnusedVariable "./foo.elm" "y" <|
            Range.manual
                { start = { row = 2, column = 6 }, end = { row = 2, column = 7 } }
                { start = { row = 2, column = 5 }, end = { row = 2, column = 6 } }
      ]
    )


unusedButDestructuredWithSameNameInRecord : ( String, String, List MessageData )
unusedButDestructuredWithSameNameInRecord =
    ( "unusedButDestructuredWithSameNameInRecord"
    , """module Foo exposing (foo)

foo x y=
  case x of
    {y} ->
      y
"""
    , [ UnusedVariable "./foo.elm" "y" <|
            Range.manual
                { start = { row = 2, column = 6 }, end = { row = 2, column = 7 } }
                { start = { row = 2, column = 5 }, end = { row = 2, column = 6 } }
      ]
    )


unusedButDestructuredWithSameNameInAs : ( String, String, List MessageData )
unusedButDestructuredWithSameNameInAs =
    ( "unusedButDestructuredWithSameNameInAs"
    , """module Foo exposing (foo)

foo x y=
  case x of
    ((1,2) as y) ->
      y
"""
    , [ UnusedVariable "./foo.elm" "y" <|
            Range.manual
                { start = { row = 2, column = 6 }, end = { row = 2, column = 7 } }
                { start = { row = 2, column = 5 }, end = { row = 2, column = 6 } }
      ]
    )


usedInDestructuringLet : ( String, String, List MessageData )
usedInDestructuringLet =
    ( "usedInDestructuringLet"
    , """module Foo exposing (..)

import Some exposing (Bar(Bar))

x =
  let
    (Bar 1) = some
  in
    1
    """
    , []
    )


unusedImportedType : ( String, String, List MessageData )
unusedImportedType =
    ( "unusedImportedType"
    , """module Foo exposing (..)

import Some exposing (Thing, Other)

x : Int -> Other
x y =
  Some.other y
    """
    , [ UnusedImportedVariable "./foo.elm" "Thing" <|
            Range.manual
                { start = { row = 2, column = 22 }, end = { row = 2, column = 27 } }
                { start = { row = 2, column = 21 }, end = { row = 2, column = 26 } }
      ]
    )


{-| Issue #96
-}
usedBinaryImportedFunctionUsedAsPrefix : ( String, String, List MessageData )
usedBinaryImportedFunctionUsedAsPrefix =
    ( "unusedImportedType"
    , """module Foo exposing (..)

import List.Extra exposing ((!!))

getItemAtIndex : Int -> Maybe String
getItemAtIndex index =
    let
        someList =
            [ "a", "b", "c" ]
    in
    (!!) someList index
    """
    , []
    )


all : Test
all =
    CTU.build "Analyser.Checks.UnusedVariable"
        UnusedVariable.checker
        [ unusedImportedType
        , withUnusedVariableInFunction
        , unusedInLetExpression
        , unusedFunction
        , usedVariableInCaseExpression
        , usedVariableAsRecordUpdate
        , usedVariableInAllDeclaration
        , usedValueConstructor
        , unusedValueConstructor
        , exposedValueConstructor
        , onlyUsedInSelf
        , usedOperator
        , unusedOperator
        , unusedImportedOperator
        , destructuringSameName
        , unusedInEffectModule
        , unusedImportedVariable
        , usedImportedVariableInPatterMatch
        , usedImportedVariableAsOpaque
        , exposeOperator
        , unusedInCasePattern
        , unusedInCasePatternAsSingle
        , unusedButDestructuredWithSameNameInList
        , unusedButDestructuredWithSameNameInTuple
        , unusedButDestructuredWithSameNameInRecord
        , unusedButDestructuredWithSameNameInAs
        , usedInDestructuringLet
        , usedBinaryImportedFunctionUsedAsPrefix
        ]
