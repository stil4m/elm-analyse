module Analyser.Checks.CoreArrayUsage exposing (checker)

import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Range as Range exposing (Range, RangeContext)
import Analyser.Messages.Schema as Schema
import Elm.Syntax.Module exposing (Import)


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


scan : RangeContext -> FileContext -> Configuration -> List MessageData
scan rangeContext fileContext _ =
    fileContext.ast.imports
        |> List.filter isArrayImport
        |> List.map (.range >> Range.build rangeContext >> buildData)
        |> List.take 1


buildData : Range -> MessageData
buildData r =
    Data.addRange "range"
        r
        (Data.init
            (String.concat
                [ "Use of `Array` is disadviced. Used at "
                , Range.asString r
                ]
            )
        )


isArrayImport : Import -> Bool
isArrayImport { moduleName } =
    moduleName == [ "Array" ]
