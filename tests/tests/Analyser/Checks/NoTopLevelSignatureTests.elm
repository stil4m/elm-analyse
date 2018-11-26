module Analyser.Checks.NoTopLevelSignatureTests exposing (all)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.NoTopLevelSignature as NoTopLevelSignature
import Analyser.Messages.Data as Data exposing (MessageData)
import Test exposing (..)


noSignature : ( String, String, List MessageData )
noSignature =
    ( "noSignature"
    , """module Bar exposing (..)


foo = 1
"""
    , [ Data.init "foo"
            |> Data.addVarName "varName" "foo"
            |> Data.addRange "range"
                { start = { row = 4, column = 1 }, end = { row = 4, column = 4 } }
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
