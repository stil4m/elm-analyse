module Analyser.Checks.DropConcatOfLists exposing (checker)

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
        { key = "DropConcatOfLists"
        , name = "Drop Concat Of Lists"
        , description = "If you concatenate two lists ([...] ++ [...]), then you can merge them into one list."
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
        { defaultConfig
            | onExpression = Post (onExpression rangeContext)
        }
        fileContext.ast
        []


onExpression : RangeContext -> Expression -> Context -> Context
onExpression rangeContext ( r, inner ) context =
    case inner of
        OperatorApplication "++" _ ( _, ListExpr _ ) ( _, ListExpr _ ) ->
            let
                range =
                    Range.build rangeContext r
            in
            (Data.init
                (String.concat
                    [ "Joining two literal lists with `++`, but instead you can just join the lists. At "
                    , Range.asString range
                    ]
                )
                |> Data.addRange "range" range
            )
                :: context

        _ ->
            context
