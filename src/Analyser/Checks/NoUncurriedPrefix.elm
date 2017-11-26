module Analyser.Checks.NoUncurriedPrefix exposing (checker)

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
        { key = "NoUncurriedPrefix"
        , name = "Fully Applied Operator as Prefix"
        , description = "It's not needed to use an operator in prefix notation when you apply both arguments directly."
        , schema = Schema.schema |> Schema.rangeProp "range" |> Schema.varProp "varName"
        }
    }


type alias Context =
    List MessageData


scan : RangeContext -> FileContext -> Configuration -> List MessageData
scan rangeContext fileContext _ =
    Inspector.inspect
        { defaultConfig
            | onExpression = Post (onExpression rangeContext)
        }
        fileContext.ast
        []


onExpression : RangeContext -> Expression -> Context -> Context
onExpression rangeContext ( _, expression ) context =
    case expression of
        Application xs ->
            case xs of
                [ ( r, PrefixOperator x ), _, _ ] ->
                    if String.startsWith ",," x then
                        context
                    else
                        let
                            range =
                                Range.build rangeContext r
                        in
                        (Data.init
                            (String.concat
                                [ "Prefix notation for `"
                                , x
                                , "` is unneeded in at "
                                , Range.asString range
                                ]
                            )
                            |> Data.addVarName "varName" x
                            |> Data.addRange "range" range
                        )
                            :: context

                _ ->
                    context

        _ ->
            context
