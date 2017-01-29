module Analyser.Checks.NoSignatureTests exposing (..)

import Analyser.Checks.NoSignature as NoSignature
import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Messages exposing (..)
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
    describe "Analyser.NotExposeAllTests"
        [ test "noSignature" <|
            \() ->
                CTU.getMessages noSignature NoSignature.scan
                    |> Expect.equal
                        (Just [ (NoTopLevelSignature "./foo.elm" "foo" { start = { row = 3, column = -1 }, end = { row = 3, column = 2 } }) ])
        , test "withSignature" <|
            \() ->
                CTU.getMessages withSignature NoSignature.scan
                    |> Expect.equal
                        (Just [])
        , test "noSignatureInLet" <|
            \() ->
                CTU.getMessages noSignatureInLet NoSignature.scan
                    |> Expect.equal (Just [])
        , test "noSignatureInLetForDestructure" <|
            \() ->
                CTU.getMessages noSignatureInLetForDestructure NoSignature.scan
                    |> Expect.equal (Just [])
        ]
