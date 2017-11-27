module Analyser.Checks.UnnecessaryListConcat exposing (checker)

import AST.Ranges as Range
import ASTUtil.Inspector as Inspector exposing (Order(Post), defaultConfig)
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Schema as Schema
import Elm.Syntax.Expression exposing (..)


checker : Checker
checker =
    { check = scan
    , info =
        { key = "UnnecessaryListConcat"
        , name = "Unnecessary List Concat"
        , description = "You should not use 'List.concat' to concatenate literal lists. Just join the lists together."
        , schema =
            Schema.schema
                |> Schema.rangeProp "range"
        }
    }


type alias Context =
    List MessageData


scan : FileContext -> Configuration -> List MessageData
scan fileContext _ =
    Inspector.inspect
        { defaultConfig
            | onExpression = Post onExpression
        }
        fileContext.ast
        []


isListExpression : Expression -> Bool
isListExpression ( _, inner ) =
    case inner of
        ListExpr _ ->
            True

        _ ->
            False


onExpression : Expression -> Context -> Context
onExpression ( r, inner ) context =
    case inner of
        Application [ ( _, QualifiedExpr [ "List" ] "concat" ), ( _, ListExpr args ) ] ->
            if List.all isListExpression args then
                let
                    range =
                        r
                in
                (Data.init
                    (String.concat
                        [ "Better merge the arguments of `List.concat` to a single list at "
                        , Range.rangeToString range
                        ]
                    )
                    |> Data.addRange "range" range
                )
                    :: context
            else
                context

        _ ->
            context
