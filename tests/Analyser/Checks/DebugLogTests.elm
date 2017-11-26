module Analyser.Checks.DebugLogTests exposing (..)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.DebugLog as DebugLog
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Range as Range
import Analyser.Messages.Types exposing (..)
import Test exposing (Test)


debugLog : ( String, String, List MessageData )
debugLog =
    ( "debugLog"
    , """module Bar exposing (..)

foo x = Debug.log "This is X" x
"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                (Range.manual
                    { start = { row = 2, column = 8 }, end = { row = 2, column = 17 } }
                    { start = { row = 2, column = 7 }, end = { row = 2, column = 16 } }
                )
      ]
    )


noDebug : ( String, String, List MessageData )
noDebug =
    ( "noDebug"
    , """module Bar exposing (..)

foo x = x
"""
    , []
    )


all : Test
all =
    CTU.build "Analyser.Checks.DebugLog"
        DebugLog.checker
        [ debugLog
        , noDebug
        ]
