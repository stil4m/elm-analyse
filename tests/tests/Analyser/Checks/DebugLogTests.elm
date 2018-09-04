module Analyser.Checks.DebugLogTests exposing (all, debugLog, noDebug)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.DebugLog as DebugLog
import Analyser.Messages.Data as Data exposing (MessageData)
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
                { start = { row = 3, column = 9 }, end = { row = 3, column = 18 } }
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
