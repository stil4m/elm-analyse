module Analyser.Checks.DuplicateRecordFieldUpdateTests exposing (..)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.DuplicateRecordFieldUpdate as DuplicateRecordFieldUpdate
import Analyser.Messages.Data as Data exposing (MessageData)
import Test exposing (..)


duplicateUpdate : ( String, String, List MessageData )
duplicateUpdate =
    ( "duplicateUpdate"
    , """module Foo exposing (..)


foo = { bar | a = x, a = y}
"""
    , [ Data.init "foo"
            |> Data.addVarName "fieldName" "a"
            |> Data.addRanges "ranges"
                [ { start = { row = 3, column = 18 }, end = { row = 3, column = 19 } }
                , { start = { row = 3, column = 25 }, end = { row = 3, column = 26 } }
                ]
      ]
    )


nonDuplicateUpdate : ( String, String, List MessageData )
nonDuplicateUpdate =
    ( "nonDuplicateUpdate"
    , """module Foo exposing (..)


foo = { bar | a = x }
"""
    , []
    )


all : Test
all =
    CTU.build "Analyser.Checks.ImportAllTests"
        DuplicateRecordFieldUpdate.checker
        [ duplicateUpdate
        , nonDuplicateUpdate
        ]
