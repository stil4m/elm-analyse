module Analyser.Checks.Base exposing (Checker, CheckerInfo)

import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data exposing (MessageData)
import Analyser.Messages.Schema exposing (Schema)


type alias Checker =
    { check : FileContext -> Configuration -> List MessageData
    , info : CheckerInfo
    }


type alias CheckerInfo =
    { key : String
    , name : String
    , description : String
    , schema : Schema
    }
