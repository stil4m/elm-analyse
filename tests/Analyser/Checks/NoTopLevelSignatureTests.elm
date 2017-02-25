module Analyser.Checks.NoTopLevelSignatureTests exposing (..)

import Analyser.Checks.NoTopLevelSignature as NoTopLevelSignature
import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Messages.Types exposing (..)
import Expect
import Test exposing (..)


noSignature : String
noSignature =
    """module Bar exposing (..)


foo = 1
"""


noSignatureInLet : String
noSignatureInLet =
    """module Bar exposing (foo)

foo : Int
foo =
  let
    b = 1
  in
    b
"""


noSignatureInLetForDestructure : String
noSignatureInLetForDestructure =
    """module Bar exposing (foo)

{name} =
  let
    b = { name = "John"}
  in
    b
"""


withSignature : String
withSignature =
    """module Bar exposing (foo)

foo : Int
foo = 1
"""


all : Test
all =
    describe "Analyser.ExposeAllTests"
        [ test "noSignature" <|
            \() ->
                CTU.getMessages noSignature NoTopLevelSignature.checker
                    |> Expect.equal
                        (Just [ (NoTopLevelSignature "./foo.elm" "foo" { start = { row = 3, column = -1 }, end = { row = 3, column = 2 } }) ])
        , test "withSignature" <|
            \() ->
                CTU.getMessages withSignature NoTopLevelSignature.checker
                    |> Expect.equal
                        (Just [])
        , test "noSignatureInLet" <|
            \() ->
                CTU.getMessages noSignatureInLet NoTopLevelSignature.checker
                    |> Expect.equal (Just [])
        , test "noSignatureInLetForDestructure" <|
            \() ->
                CTU.getMessages noSignatureInLetForDestructure NoTopLevelSignature.checker
                    |> Expect.equal (Just [])
        ]
