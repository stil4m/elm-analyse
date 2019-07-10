module Analyser.Checks.UnusedTopLevelTests exposing (all)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.UnusedTopLevel as UnusedTopLevel
import Analyser.Files.Types exposing (..)
import Analyser.Messages.Data as Data exposing (MessageData)
import Dict
import Test exposing (..)


unusedFunction : ( String, String, List MessageData )
unusedFunction =
    ( "unusedFunction"
    , """module Bar exposing (foo)

foo = some

baz = 2

some = 1
"""
    , [ Data.init "foo"
            |> Data.addVarName "varName" "baz"
            |> Data.addRange "range"
                { start = { row = 5, column = 1 }, end = { row = 5, column = 4 } }
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


unusedValueConstructorNotExposed : ( String, String, List MessageData )
unusedValueConstructorNotExposed =
    ( "unusedValueConstructor"
    , """module Bar exposing (foo,Some)

type Some = Thing | Other

"""
    , [ Data.init "foo"
            |> Data.addVarName "varName" "Other"
            |> Data.addRange "range"
                { start = { row = 3, column = 21 }, end = { row = 3, column = 26 } }
      , Data.init "foo"
            |> Data.addVarName "varName" "Thing"
            |> Data.addRange "range"
                { end = { column = 18, row = 3 }, start = { column = 13, row = 3 } }
      ]
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


onlyUsedInSelf : ( String, String, List MessageData )
onlyUsedInSelf =
    ( "onlyUsedInSelf"
    , """module Bar exposing (foo,Some(..))
type Some = Thing

foo = 1

bar = bar + foo
"""
    , [ Data.init "foo"
            |> Data.addVarName "varName" "bar"
            |> Data.addRange "range"
                { start = { row = 6, column = 1 }, end = { row = 6, column = 4 } }
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
    CTU.build "Analyser.Checks.UnusedTopLevel"
        UnusedTopLevel.checker
        [ unusedFunction
        , usedVariableInCaseExpression
        , usedVariableAsRecordUpdate
        , usedVariableInAllDeclaration
        , usedValueConstructor
        , unusedValueConstructorNotExposed
        , exposedValueConstructor
        , onlyUsedInSelf
        , destructuringSameName
        , unusedInEffectModule
        , usedImportedVariableInPatterMatch
        , usedImportedVariableAsOpaque
        , usedInDestructuringLet
        , usedBinaryImportedFunctionUsedAsPrefix
        ]
