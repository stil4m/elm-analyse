module Analyser.Checks.Base exposing (Checker, keyBasedChecker, foo)

import Analyser.Configuration exposing (Configuration, checkEnabled)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Types exposing (Message)
import Analyser.Messages.Range exposing (RangeContext)


type alias Checker =
    { shouldCheck : Configuration -> Bool
    , check : RangeContext -> FileContext -> Configuration -> List Message
    }


foo : Int
foo =
    Maybe.map ((+) 1) (Just 1)
        |> Maybe.withDefault 0


keyBasedChecker : List String -> Configuration -> Bool
keyBasedChecker keys configuration =
    List.any (flip checkEnabled configuration) keys
