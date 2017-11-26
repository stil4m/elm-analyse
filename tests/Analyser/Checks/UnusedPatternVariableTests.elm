module Analyser.Checks.UnusedPatternVariableTests exposing (..)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.UnusedPatternVariable as UnusedPatternVariable
import Analyser.Files.Types exposing (..)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Range as Range
import Dict
import Test exposing (..)


table : OperatorTable
table =
    Dict.fromList []


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


exposedValueConstructor : ( String, String, List MessageData )
exposedValueConstructor =
    ( "exposedValueConstructor"
    , """module Bar exposing (foo,Some(Thing))
type Some = Thing


foo = 1
"""
    , []
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
    ( "exposeOperator"
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
    , [ Data.init "foo"
            |> Data.addVarName "varName" "y"
            |> Data.addRange "range"
                (Range.manual
                    { start = { row = 5, column = 9 }, end = { row = 5, column = 10 } }
                    { start = { row = 5, column = 8 }, end = { row = 5, column = 9 } }
                )
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
    , [ Data.init "foo"
            |> Data.addVarName "varName" "y"
            |> Data.addRange "range"
                (Range.manual
                    { start = { row = 5, column = 4 }, end = { row = 5, column = 5 } }
                    { start = { row = 5, column = 3 }, end = { row = 5, column = 4 } }
                )
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


{-| Issue #96
-}
usedBinaryImportedFunctionUsedAsPrefix : ( String, String, List MessageData )
usedBinaryImportedFunctionUsedAsPrefix =
    ( "usedBinaryImportedFunctionUsedAsPrefix"
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
    CTU.build "Analyser.Checks.UnusedPatternVariable"
        UnusedPatternVariable.checker
        [ usedVariableInCaseExpression
        , usedVariableAsRecordUpdate
        , usedVariableInAllDeclaration
        , usedValueConstructor
        , exposedValueConstructor
        , usedOperator
        , destructuringSameName
        , unusedInEffectModule
        , usedImportedVariableInPatterMatch
        , usedImportedVariableAsOpaque
        , exposeOperator
        , unusedInCasePattern
        , unusedInCasePatternAsSingle
        , usedInDestructuringLet
        , usedBinaryImportedFunctionUsedAsPrefix
        ]
