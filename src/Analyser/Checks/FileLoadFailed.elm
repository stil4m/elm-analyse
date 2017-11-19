module Analyser.Checks.FileLoadFailed exposing (checker)

import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data exposing (MessageData)
import Analyser.Messages.Range exposing (RangeContext)
import Analyser.Messages.Schema as Schema
import Debug as SafeDebug


checker : Checker
checker =
    { check = scan
    , info =
        { key = "FileLoadFailed"
        , name = "FileLoadFailed"
        , description = "We could not analyse this file..."
        , schema =
            Schema.schema
                |> Schema.errorProp "message"
        }
    }


scan : RangeContext -> FileContext -> Configuration -> List MessageData
scan _ _ _ =
    SafeDebug.crash "Something is completely wrong"
