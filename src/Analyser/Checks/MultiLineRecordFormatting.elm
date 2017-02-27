module Analyser.Checks.MultiLineRecordFormatting exposing (checker)

import Analyser.FileContext exposing (FileContext)
import Analyser.Configuration as Configuration exposing (Configuration)
import Analyser.Checks.Base exposing (Checker, keyBasedChecker)
import Analyser.Messages.Types exposing (Message, MessageData(UseConsOverConcat, DropConcatOfLists, DropConsOfItemAndList), newMessage)


checker : Checker
checker =
    { check = scan
    , shouldCheck = keyBasedChecker [ "MultiLineRecordFormatting" ]
    }


scan : FileContext -> Configuration -> List Message
scan fileContext configuration =
    []
