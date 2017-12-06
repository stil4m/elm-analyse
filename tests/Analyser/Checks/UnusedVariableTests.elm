module Analyser.Checks.UnusedVariableTests exposing (..)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.UnusedVariable as UnusedVariable
import Analyser.Files.Types exposing (..)
import Analyser.Messages.Data as Data exposing (MessageData)
import Dict
import Test exposing (..)


table : OperatorTable
table =
    Dict.fromList []


withUnusedVariableInFunction : ( String, String, List MessageData )
withUnusedVariableInFunction =
    ( "withUnusedVariableInFunction"
    , """module Bar exposing (..)

bar x y z = x + z
"""
    , [ Data.init "foo"
            |> Data.addVarName "varName" "y"
            |> Data.addRange "range"
                { start = { row = 2, column = 6 }, end = { row = 2, column = 7 } }
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
    , [ Data.init "foo"
            |> Data.addVarName "varName" "y"
            |> Data.addRange "range"
                { start = { row = 4, column = 4 }, end = { row = 4, column = 5 } }
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


unusedButDestructuredWithSameNameInList : ( String, String, List MessageData )
unusedButDestructuredWithSameNameInList =
    ( "unusedButDestructuredWithSameNameInList"
    , """module Foo exposing (foo)

foo x y=
  case x of
    [y] ->
      y
"""
    , [ Data.init "foo"
            |> Data.addVarName "varName" "y"
            |> Data.addRange "range"
                { start = { row = 2, column = 6 }, end = { row = 2, column = 7 } }
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
    , [ Data.init "foo"
            |> Data.addVarName "varName" "y"
            |> Data.addRange "range"
                { start = { row = 2, column = 6 }, end = { row = 2, column = 7 } }
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
    , [ Data.init "foo"
            |> Data.addVarName "varName" "y"
            |> Data.addRange "range"
                { start = { row = 2, column = 6 }, end = { row = 2, column = 7 } }
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
    , [ Data.init "foo"
            |> Data.addVarName "varName" "y"
            |> Data.addRange "range"
                { start = { row = 2, column = 6 }, end = { row = 2, column = 7 } }
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
    CTU.build "Analyser.Checks.UnusedVariable"
        UnusedVariable.checker
        [ withUnusedVariableInFunction
        , unusedInLetExpression
        , usedVariableInCaseExpression
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
        , unusedButDestructuredWithSameNameInList
        , unusedButDestructuredWithSameNameInTuple
        , unusedButDestructuredWithSameNameInRecord
        , unusedButDestructuredWithSameNameInAs
        , usedInDestructuringLet
        , usedBinaryImportedFunctionUsedAsPrefix
        ]
