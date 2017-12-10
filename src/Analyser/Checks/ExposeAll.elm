module Analyser.Checks.ExposeAll exposing (checker)

import AST.Ranges as Range
import AST.Util
import ASTUtil.Inspector as Inspector exposing (Order(Inner), defaultConfig)
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Schema as Schema
import Elm.Syntax.Exposing exposing (Exposing(..))
import Elm.Syntax.File exposing (File)


checker : Checker
checker =
    { check = scan
    , info =
        { key = "ExposeAll"
        , name = "Expose All"
        , description = "You want to be clear about the API that a module defines."
        , schema =
            Schema.schema
                |> Schema.rangeProp "range"
        }
    }


type alias ExposeAllContext =
    List MessageData


scan : FileContext -> Configuration -> List MessageData
scan fileContext _ =
    Inspector.inspect
        { defaultConfig | onFile = Inner onFile }
        fileContext.ast
        []


onFile : (ExposeAllContext -> ExposeAllContext) -> File -> ExposeAllContext -> ExposeAllContext
onFile _ file _ =
    case AST.Util.fileExposingList file of
        All x ->
            let
                range =
                    x
            in
            [ Data.init
                (String.concat
                    [ "Exposing all at "
                    , Range.rangeToString range
                    ]
                )
                |> Data.addRange "range" range
            ]

        Explicit _ ->
            []
