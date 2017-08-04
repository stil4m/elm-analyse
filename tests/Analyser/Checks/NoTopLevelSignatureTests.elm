module Analyser.Checks.NoTopLevelSignatureTests exposing (..)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.NoTopLevelSignature as NoTopLevelSignature
import Analyser.Messages.Range as Range
import Analyser.Messages.Types exposing (..)
import Test exposing (..)


noSignature : ( String, String, List MessageData )
noSignature =
    ( "noSignature"
    , """module Bar exposing (..)


foo = 1
"""
    , [ NoTopLevelSignature "./foo.elm" "foo" <|
            Range.manual
                { start = { row = 3, column = 0 }, end = { row = 3, column = 3 } }
                { start = { row = 3, column = -1 }, end = { row = 3, column = 2 } }
      ]
    )


noSignatureInLet : ( String, String, List MessageData )
noSignatureInLet =
    ( "noSignatureInLet"
    , """module Bar exposing (foo)

foo : Int
foo =
  let
    b = 1
  in
    b
"""
    , []
    )


noSignatureInLetForDestructure : ( String, String, List MessageData )
noSignatureInLetForDestructure =
    ( "noSignatureInLetForDestructure"
    , """module Bar exposing (foo)

{name} =
  let
    b = { name = "John"}
  in
    b
"""
    , []
    )


withSignature : ( String, String, List MessageData )
withSignature =
    ( "withSignature"
    , """module Bar exposing (foo)

foo : Int
foo = 1
"""
    , []
    )


all : Test
all =
    CTU.build "Analyser.Checks.NoTopLevelSignature"
        NoTopLevelSignature.checker
        [ noSignature
        , noSignatureInLet
        , noSignatureInLetForDestructure
        , withSignature
        ]
