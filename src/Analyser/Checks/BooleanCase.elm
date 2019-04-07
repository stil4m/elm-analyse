module Analyser.Checks.BooleanCase exposing (checker)

import AST.Ranges as Range
import ASTUtil.Inspector as Inspector exposing (Order(..), defaultConfig)
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Schema as Schema
import Elm.Syntax.Expression exposing (Case, Expression(..))
import Elm.Syntax.Node exposing (Node(..))
import Elm.Syntax.Pattern exposing (Pattern(..))


checker : Checker
checker =
    { check = scan
    , info =
        { key = "BooleanCase"
        , name = "Boolean Case Expression"
        , description = "If you case over a boolean value, it maybe better to use an if expression."
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
        CaseExpression caseExpression ->
            if List.any isBooleanCase caseExpression.cases then
                (Data.init
                    (String.concat
                        [ "Use an if-block instead of an case expression "
                        , Range.rangeToString r
                        ]
                    )
                    |> Data.addRange "range" r
                )
                    :: context

            else
                context

        _ ->
            context


isBooleanCase : Case -> Bool
isBooleanCase ( Node _ pattern, _ ) =
    case pattern of
        NamedPattern qnr [] ->
            qnr.moduleName == [] && (qnr.name == "True" || qnr.name == "False")

        _ ->
            False
