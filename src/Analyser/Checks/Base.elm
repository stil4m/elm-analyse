module Analyser.Checks.Base exposing (Checker, foo, keyBasedChecker)

import Analyser.Configuration exposing (Configuration, checkEnabled)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Range exposing (RangeContext)
import Analyser.Messages.Types exposing (Message)


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
