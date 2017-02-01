module Analyser.Checks.UnusedAliases exposing (scan)

import Analyser.FileContext exposing (FileContext)
import Analyser.Messages exposing (Message(ImportAll))
import Dict exposing (Dict)


type alias Context =
    Dict String Int


scan : FileContext -> List Message
scan fileContext =
    []
