module Analyser.Checks.Base exposing (Checker, keyBasedChecker)

import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Types exposing (Message)
import Dict


type alias Checker =
    { shouldCheck : Configuration -> Bool
    , check : FileContext -> Configuration -> List Message
    }


keyBasedChecker : List String -> Configuration -> Bool
keyBasedChecker keys { checks } =
    List.any (flip Dict.get checks >> Maybe.withDefault True) keys
