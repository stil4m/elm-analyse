module Analyser.Checks.UnusedImportedVariableTests exposing (all)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.UnusedImportedVariable as UnusedImportedVariable
import Analyser.Files.Types exposing (..)
import Analyser.Messages.Data as Data exposing (MessageData)
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
    , """module Bar exposing (foo,Some(..))
type Some = Thing


foo = 1
"""
    , []
    )


unusedImportedOperator : ( String, String, List MessageData )
unusedImportedOperator =
    ( "unusedImportedOperator"
    , """module Bar exposing (foo)

import Foo exposing ((!!))

foo = 1

"""
    , [ Data.init "foo"
            |> Data.addVarName "varName" "!!"
            |> Data.addRange "range"
                { start = { row = 3, column = 22 }, end = { row = 3, column = 26 } }
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
    , [ Data.init "foo"
            |> Data.addVarName "varName" "div"
            |> Data.addRange "range"
                { start = { row = 3, column = 23 }, end = { row = 3, column = 26 } }
      ]
    )


usedImportedVariableInPatterMatch : ( String, String, List MessageData )
usedImportedVariableInPatterMatch =
    ( "usedImportedVariableInPatterMatch"
    , """module Foo exposing (foo)

import Color exposing (Color(..))

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

import Color exposing (Color(..))

foo (Blue c) =
  c
"""
    , []
    )


usedInDestructuringLet : ( String, String, List MessageData )
usedInDestructuringLet =
    ( "usedInDestructuringLet"
    , """module Foo exposing (..)

import Some exposing (Bar(..))

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
    , [ Data.init "foo"
            |> Data.addVarName "varName" "Thing"
            |> Data.addRange "range"
                { start = { row = 3, column = 23 }, end = { row = 3, column = 28 } }
      ]
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
    CTU.build "Analyser.Checks.UnusedImportedVariable"
        UnusedImportedVariable.checker
        [ unusedImportedType
        , usedVariableInCaseExpression
        , usedVariableAsRecordUpdate
        , usedVariableInAllDeclaration
        , usedValueConstructor
        , exposedValueConstructor
        , unusedImportedOperator
        , destructuringSameName
        , unusedInEffectModule
        , unusedImportedVariable
        , usedImportedVariableInPatterMatch
        , usedImportedVariableAsOpaque
        , usedInDestructuringLet
        , usedBinaryImportedFunctionUsedAsPrefix
        ]
