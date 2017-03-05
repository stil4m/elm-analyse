module Analyser.Checks.Base exposing (Checker, keyBasedChecker)

import Analyser.Configuration exposing (Configuration, checkEnabled)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Types exposing (Message)


type alias Checker =
    { shouldCheck : Configuration -> Bool
    , check : FileContext -> Configuration -> List Message
    }


keyBasedChecker : List String -> Configuration -> Bool
keyBasedChecker keys configuration =
    List.any (flip checkEnabled configuration) keys
