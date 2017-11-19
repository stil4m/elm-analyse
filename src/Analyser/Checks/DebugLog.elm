module Analyser.Checks.DebugLog exposing (checker)

import ASTUtil.Inspector as Inspector exposing (Order(Post), defaultConfig)
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Range as Range exposing (RangeContext)
import Analyser.Messages.Schema as Schema
import Elm.Syntax.Expression exposing (..)


checker : Checker
checker =
    { check = scan
    , info =
        { key = "DebugLog"
        , name = "Debug Log"
        , description = "This is nice for development, but you do not want to ship this to package users or your end users."
        , schema =
            Schema.schema
                |> Schema.rangeProp "range"
        }
    }


type alias Context =
    List MessageData


scan : RangeContext -> FileContext -> Configuration -> List MessageData
scan rangeContext fileContext _ =
    Inspector.inspect
        { defaultConfig | onExpression = Post (onExpression rangeContext) }
        fileContext.ast
        []


onExpression : RangeContext -> Expression -> Context -> Context
onExpression rangeContext ( range, expression ) context =
    case expression of
        QualifiedExpr moduleName f ->
            if entryForQualifiedExpr moduleName f then
                let
                    r =
                        Range.build rangeContext range
                in
                (Data.init
                    (String.concat
                        [ "Use of Debug.log at "
                        , Range.asString r
                        ]
                    )
                    |> Data.addRange "range" r
                )
                    :: context
            else
                context

        _ ->
            context


entryForQualifiedExpr : List String -> String -> Bool
entryForQualifiedExpr moduleName f =
    if moduleName == [ "Debug" ] then
        if f == "log" then
            True
        else
            False
    else
        False
