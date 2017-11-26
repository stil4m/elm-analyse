module Analyser.Checks.ImportAll exposing (checker)

import ASTUtil.Inspector as Inspector exposing (Order(Post), defaultConfig)
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Range as Range exposing (RangeContext)
import Analyser.Messages.Schema as Schema
import Elm.Syntax.Exposing exposing (..)
import Elm.Syntax.Module exposing (..)


checker : Checker
checker =
    { check = scan
    , info =
        { key = "ImportAll"
        , name = "Import All"
        , description = "When other people read your code, it would be nice if the origin of a used function can be traced back to the providing module."
        , schema =
            Schema.schema
                |> Schema.rangeProp "range"
                |> Schema.moduleProp "moduleName"
        }
    }


type alias ExposeAllContext =
    List MessageData


scan : RangeContext -> FileContext -> Configuration -> List MessageData
scan rangeContext fileContext _ =
    Inspector.inspect
        { defaultConfig | onImport = Post (onImport rangeContext) }
        fileContext.ast
        []


onImport : RangeContext -> Import -> ExposeAllContext -> ExposeAllContext
onImport rangeContext imp context =
    flip List.append context <|
        case imp.exposingList of
            Just (All range) ->
                let
                    r =
                        Range.build rangeContext range
                in
                [ Data.init
                    (String.concat
                        [ "Importing all from module `"
                        , String.join "." imp.moduleName
                        , "` at "
                        , Range.asString r
                        ]
                    )
                    |> Data.addRange "range" r
                    |> Data.addModuleName "moduleName" imp.moduleName
                ]

            Nothing ->
                []

            Just (Explicit _) ->
                []
