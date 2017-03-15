module Analyser.Checks.CoreArrayUsage exposing (checker)

import Analyser.Messages.Types exposing (Message, MessageData(CoreArrayUsage), newMessage)
import AST.Types exposing (InnerExpression, ModuleName, Import)
import Analyser.FileContext exposing (FileContext)
import Analyser.Configuration exposing (Configuration)
import Analyser.Checks.Base exposing (Checker, keyBasedChecker)


checker : Checker
checker =
    { check = scan
    , shouldCheck = keyBasedChecker [ "CoreArrayUsage" ]
    }


scan : FileContext -> Configuration -> List Message
scan fileContext _ =
    fileContext.ast.imports
        |> List.filter isArrayImport
        |> List.map (.range >> CoreArrayUsage fileContext.path)
        |> List.map (newMessage [ ( fileContext.sha1, fileContext.path ) ])
        |> List.take 1


isArrayImport : Import -> Bool
isArrayImport { moduleName } =
    moduleName == [ "Array" ]
