module Analyser.Checks.CoreArrayUsage exposing (checker)

import Analyser.Messages.Types exposing (Message, MessageData(CoreArrayUsage), newMessage)
import Elm.Syntax.Module exposing (Import)
import Analyser.FileContext exposing (FileContext)
import Analyser.Configuration exposing (Configuration)
import Analyser.Checks.Base exposing (Checker, keyBasedChecker)
import Analyser.Messages.Range as Range exposing (RangeContext)


checker : Checker
checker =
    { check = scan
    , shouldCheck = keyBasedChecker [ "CoreArrayUsage" ]
    }


scan : RangeContext -> FileContext -> Configuration -> List Message
scan _ fileContext _ =
    fileContext.ast.imports
        |> List.filter isArrayImport
        |> List.map (.range >> Range.build >> CoreArrayUsage fileContext.path)
        |> List.map (newMessage [ ( fileContext.sha1, fileContext.path ) ])
        |> List.take 1


isArrayImport : Import -> Bool
isArrayImport { moduleName } =
    moduleName == [ "Array" ]
