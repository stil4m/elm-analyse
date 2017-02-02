module Analyser.Checks.UnusedVariableTests exposing (..)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.UnusedVariable as UnusedVariable
import Analyser.Types exposing (..)
import Dict exposing (Dict)
import Test exposing (..)
import Analyser.Messages exposing (..)
import Analyser.Checks.CheckTestUtil exposing (getMessages)


table : OperatorTable
table =
    Dict.fromList []


withUnusedVariableInFunction : ( String, String, List Message )
withUnusedVariableInFunction =
    ( "withUnusedVariableInFunction"
    , """module Bar exposing (..)

bar x y z = x + z
"""
    , [ (UnusedVariable "./foo.elm" "y" { start = { row = 2, column = 5 }, end = { row = 2, column = 6 } }) ]
    )


unusedInLetExpression : ( String, String, List Message )
unusedInLetExpression =
    ( "unusedInLetExpression"
    , """module Bar exposing (..)

x =
  let
    y = 1
  in
    2
"""
    , [ (UnusedVariable "./foo.elm" "y" { start = { row = 4, column = 3 }, end = { row = 4, column = 4 } })
      ]
    )


unusedFunction : ( String, String, List Message )
unusedFunction =
    ( "unusedFunction"
    , """module Bar exposing (foo)

foo = some

baz = 2

some = 1
"""
    , [ UnusedTopLevel "./foo.elm" "baz" { start = { row = 4, column = -1 }, end = { row = 4, column = 2 } }
      ]
    )


usedVariableAsRecordUpdate : ( String, String, List Message )
usedVariableAsRecordUpdate =
    ( "usedVariableAsRecordUpdate"
    , """module Bar exposing (..)

addUsedVariable x =
    { x | name = "John" }

"""
    , []
    )


usedVariableInCaseExpression : ( String, String, List Message )
usedVariableInCaseExpression =
    ( "usedVariableInCaseExpression"
    , """module Bar exposing (..)

foo x =
    case x of
      Bar -> 1

"""
    , []
    )


usedVariableInAllDeclaration : ( String, String, List Message )
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


usedValueConstructor : ( String, String, List Message )
usedValueConstructor =
    ( "usedValueConstructor"
    , """module Bar exposing (foo)
type Some = Thing


foo = Thing
"""
    , []
    )


unusedValueConstructor : ( String, String, List Message )
unusedValueConstructor =
    ( "unusedValueConstructor"
    , """module Bar exposing (foo,Some(Thing))

type Some = Thing | Other

"""
    , [ UnusedTopLevel "./foo.elm" "Other" { start = { row = 2, column = 19 }, end = { row = 3, column = -2 } }
      ]
    )


exposedValueConstructor : ( String, String, List Message )
exposedValueConstructor =
    ( "exposedValueConstructor"
    , """module Bar exposing (foo,Some(Thing))
type Some = Thing


foo = 1
"""
    , []
    )


onlyUsedInSelf : ( String, String, List Message )
onlyUsedInSelf =
    ( "onlyUsedInSelf"
    , """module Bar exposing (foo,Some(Thing))
type Some = Thing

foo = 1

bar = bar + foo
"""
    , [ UnusedTopLevel "./foo.elm" "bar" { start = { row = 5, column = -1 }, end = { row = 5, column = 2 } }
      ]
    )


usedOperator : ( String, String, List Message )
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


destructuringSameName : ( String, String, List Message )
destructuringSameName =
    ( "destructuringSameName"
    , """module Foo exposing (..)

error : Model -> Maybe Error
error { error } =
    error
"""
    , []
    )


unusedInEffectModule : ( String, String, List Message )
unusedInEffectModule =
    ( "unusedInEffectModule"
    , """effect module X where {subscription = MySub} exposing (foo)


foo = 1

init = 2
"""
    , []
    )


unusedImportedVariable : ( String, String, List Message )
unusedImportedVariable =
    ( "unusedInEffectModule"
    , """module Foo exposing (foo)

import Html exposing (div)

foo = 1
"""
    , [ UnusedTopLevel "./foo.elm" "div" { start = { row = 5, column = -1 }, end = { row = 5, column = 2 } }
      ]
    )


all : Test
all =
    CTU.build "Analyser.Checks.UnusedVariable"
        UnusedVariable.scan
        [ withUnusedVariableInFunction
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
        , destructuringSameName
        , unusedInEffectModule
        , unusedImportedVariable
        ]
