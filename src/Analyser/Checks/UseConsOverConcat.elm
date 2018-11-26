module Analyser.Checks.UseConsOverConcat exposing (checker)

import AST.Ranges as Range
import ASTUtil.Inspector as Inspector exposing (Order(..), defaultConfig)
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Schema as Schema
import Elm.Syntax.Expression exposing (Expression(..))
import Elm.Syntax.Node exposing (Node(..))


checker : Checker
checker =
    { check = scan
    , info =
        { key = "UseConsOverConcat"
        , name = "Use Cons Over Concat"
        , description = "If you concatenate two lists, but the right hand side is a single element list, then you should use the cons operator."
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


onExpression : Node Expression -> Context -> Context
onExpression (Node r inner) context =
    case inner of
        OperatorApplication "++" _ (Node _ (ListExpr [ _ ])) _ ->
            (Data.init
                (String.concat
                    [ "Use `::` instead of `++` at "
                    , Range.rangeToString r
                    ]
                )
                |> Data.addRange "range" r
            )
                :: context

        _ ->
            context
