module Analyser.Checks.UnusedVariableTests exposing (..)

import Analyser.Checks.UnusedVariable as UnusedVariable
import Analyser.Types exposing (..)
import Dict exposing (Dict)
import Expect
import Test exposing (..)
import Analyser.Messages exposing (..)
import Analyser.Checks.CheckTestUtil exposing (getMessages)


table : OperatorTable
table =
    Dict.fromList []


withUnusedVariableInFunction : String
withUnusedVariableInFunction =
    """module Bar exposing (..)

bar x y z = x + z
"""


unusedInLetExpression : String
unusedInLetExpression =
    """module Bar exposing (..)

x =
  let
    y = 1
  in
    2
"""


unusedFunction : String
unusedFunction =
    """module Bar exposing (foo)

foo = some

baz = 2

some = 1
"""


usedVariableAsRecordUpdate : String
usedVariableAsRecordUpdate =
    """module Bar exposing (..)

addUsedVariable x =
    { x | name = "John" }

"""


usedVariableInCaseExpression : String
usedVariableInCaseExpression =
    """module Bar exposing (..)

foo x =
    case x of
      Bar -> 1

"""


usedVariableInAllDeclaration : String
usedVariableInAllDeclaration =
    """module Bar exposing (..)

x y =
  case y of
   ( b, _ ) ->
    let
        _ =
            Debug.log "Unknown" b
    in
        model ! []"""


usedValueConstructor : String
usedValueConstructor =
    """module Bar exposing (foo)
type Some = Thing


foo = Thing
"""


unusedValueConstructor : String
unusedValueConstructor =
    """module Bar exposing (foo,Some(Thing))

type Some = Thing | Other

"""


exposedValueConstructor : String
exposedValueConstructor =
    """module Bar exposing (foo,Some(Thing))
type Some = Thing


foo = 1
"""


onlyUsedInSelf : String
onlyUsedInSelf =
    """module Bar exposing (foo,Some(Thing))
type Some = Thing

foo = 1

bar = bar + foo
"""


usedOperator : String
usedOperator =
    """module Bar exposing (foo,Some(Thing))
type Some = Thing

(&>) _ b = b

foo =
    1 &> 2
"""


destructuringSameName : String
destructuringSameName =
    """module Foo exposing (..)

error : Model -> Maybe Error
error { error } =
    error
"""


all : Test
all =
    describe "Analyser.PostProcessingTests"
        [ test "withUnusedVariableInFunction" <|
            \() ->
                getMessages withUnusedVariableInFunction UnusedVariable.scan
                    |> Expect.equal
                        (Just
                            [ (UnusedVariable "./foo.elm" "y" { start = { row = 2, column = 5 }, end = { row = 2, column = 6 } }) ]
                        )
        , test "unusedInLetExpression" <|
            \() ->
                getMessages unusedInLetExpression UnusedVariable.scan
                    |> Expect.equal (Just ([ (UnusedVariable "./foo.elm" "y" { start = { row = 4, column = 3 }, end = { row = 4, column = 4 } }) ]))
        , test "unusedFunction" <|
            \() ->
                getMessages unusedFunction UnusedVariable.scan
                    |> Expect.equal (Just ([ UnusedTopLevel "./foo.elm" "baz" { start = { row = 4, column = -1 }, end = { row = 4, column = 2 } } ]))
        , test "usedVariableAsRecordUpdate" <|
            \() -> getMessages usedVariableAsRecordUpdate UnusedVariable.scan |> Expect.equal (Just [])
        , test "usedVariableInCaseExpression" <|
            \() -> getMessages usedVariableInCaseExpression UnusedVariable.scan |> Expect.equal (Just [])
        , test "usedVariableInAllDeclaration" <|
            \() -> getMessages usedVariableInAllDeclaration UnusedVariable.scan |> Expect.equal (Just [])
        , test "usedValueConstructor" <|
            \() -> getMessages usedValueConstructor UnusedVariable.scan |> Expect.equal (Just [])
        , test "unusedValueConstructor" <|
            \() ->
                getMessages unusedValueConstructor UnusedVariable.scan
                    |> Expect.equal (Just ([ UnusedTopLevel "./foo.elm" "Other" { start = { row = 2, column = 19 }, end = { row = 3, column = -2 } } ]))
        , test "exposedValueConstructor" <|
            \() -> getMessages exposedValueConstructor UnusedVariable.scan |> Expect.equal (Just [])
        , test "onlyUsedInSelf" <|
            \() ->
                getMessages onlyUsedInSelf UnusedVariable.scan
                    |> Expect.equal (Just ([ UnusedTopLevel "./foo.elm" "bar" { start = { row = 5, column = -1 }, end = { row = 5, column = 2 } } ]))
        , test "usedOperator" <|
            \() ->
                getMessages usedOperator UnusedVariable.scan
                    |> Expect.equal (Just ([]))
        , test "destructuringSameName" <|
            \() ->
                getMessages destructuringSameName UnusedVariable.scan
                    |> Expect.equal (Just ([]))
        ]
