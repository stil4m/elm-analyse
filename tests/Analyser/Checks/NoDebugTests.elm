module Analyser.Checks.NoDebugTests exposing (..)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.NoDebug as NoDebug
import Analyser.Messages.Range as Range
import Analyser.Messages.Types exposing (..)
import Test exposing (Test)


debugCrash : ( String, String, List MessageData )
debugCrash =
    ( "debugCrash"
    , """module Bar exposing (..)

foo = Debug.crash "NOOO"

"""
    , [ DebugCrash "./foo.elm" <|
            Range.manual
                { start = { row = 2, column = 6 }, end = { row = 2, column = 17 } }
                { start = { row = 2, column = 5 }, end = { row = 2, column = 16 } }
      ]
    )


debugLog : ( String, String, List MessageData )
debugLog =
    ( "debugLog"
    , """module Bar exposing (..)

foo x = Debug.log "This is X" x
"""
    , [ DebugLog "./foo.elm" <|
            Range.manual
                { start = { row = 2, column = 8 }, end = { row = 2, column = 17 } }
                { start = { row = 2, column = 7 }, end = { row = 2, column = 16 } }
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
    CTU.build "Analyser.Checks.NoDebugTests"
        NoDebug.checker
        [ debugCrash
        , debugLog
        , noDebug
        ]
