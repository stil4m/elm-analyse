module Analyser.Checks.CoreArrayUsage exposing (checker)

import AST.Ranges as Range
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Schema as Schema
import Elm.Syntax.Module exposing (Import)
import Elm.Syntax.Range as Range exposing (Range)


checker : Checker
checker =
    { check = scan
    , info =
        { key = "CoreArrayUsage"
        , name = "Core Array Usage"
        , description = "Arrays dont work well in 0.18. Try Skinney/elm-array-exploration for now."
        , schema =
            Schema.schema
                |> Schema.rangeProp "range"
        }
    }


scan : FileContext -> Configuration -> List MessageData
scan fileContext _ =
    fileContext.ast.imports
        |> List.filter isArrayImport
        |> List.map (.range >> buildData)
        |> List.take 1


buildData : Range -> MessageData
buildData r =
    Data.addRange "range"
        r
        (Data.init
            (String.concat
                [ "Use of `Array` is disadviced. Used at "
                , Range.rangeToString r
                ]
            )
        )


isArrayImport : Import -> Bool
isArrayImport { moduleName } =
    moduleName == [ "Array" ]
