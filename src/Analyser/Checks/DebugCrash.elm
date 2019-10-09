module Analyser.Checks.DebugCrash exposing (checker)

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
        { key = "DebugTodo"
        , name = "Debug Todo"
        , description = "You may not want to ship this to your end users."
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
        { defaultConfig | onExpression = Post onExpression }
        fileContext.ast
        []


onExpression : Node Expression -> Context -> Context
onExpression (Node range expression) context =
    case expression of
        FunctionOrValue moduleName f ->
            if entryForQualifiedExpr moduleName f then
                let
                    r =
                        range
                in
                (Data.init
                    (String.concat
                        [ "Use of Debug.todo at "
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


entryForQualifiedExpr : List String -> String -> Bool
entryForQualifiedExpr moduleName f =
    if moduleName == [ "Debug" ] then
        f == "todo"

    else
        False
