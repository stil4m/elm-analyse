module Analyser.Checks.NoDebugTests exposing (..)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.NoDebug as NoDebug
import Analyser.Messages exposing (..)
import Test exposing (Test)


debugCrash : ( String, String, List Message )
debugCrash =
    ( "debugCrash"
    , """module Bar exposing (..)

foo = Debug.crash "NOOO"

"""
    , [ DebugCrash "./foo.elm" { start = { row = 2, column = 5 }, end = { row = 2, column = 16 } }
      ]
    )


debugLog : ( String, String, List Message )
debugLog =
    ( "debugLog"
    , """module Bar exposing (..)

foo x = Debug.log "This is X" x
"""
    , [ DebugLog "./foo.elm" { start = { row = 2, column = 7 }, end = { row = 2, column = 16 } }
      ]
    )


noDebug : ( String, String, List Message )
noDebug =
    ( "noDebug"
    , """module Bar exposing (..)

foo x = x
"""
    , []
    )


all : Test
all =
    CTU.build "Analyser.Checks.NoDebugTests"
        NoDebug.scan
        [ debugCrash
        , debugLog
        , noDebug
        ]
