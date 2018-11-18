module Analyser.Checks.NoUncurriedPrefix exposing (checker)

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
        { key = "NoUncurriedPrefix"
        , name = "Fully Applied Operator as Prefix"
        , description = "It's not needed to use an operator in prefix notation when you apply both arguments directly."
        , schema =
            Schema.schema
                |> Schema.varProp "varName"
                |> Schema.rangeProp "range"
                |> Schema.rangeProp "arg1"
                |> Schema.rangeProp "arg2"
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
onExpression (Node _ expression) context =
    case expression of
        Application [ Node opRange (PrefixOperator x), Node argRange1 _, Node argRange2 _ ] ->
            -- Allow 3-tuple or greater as prefix.
            if String.startsWith ",," x then
                context

            else
                (Data.init
                    (String.concat
                        [ "Prefix notation for `"
                        , x
                        , "` is unneeded at "
                        , Range.rangeToString opRange
                        ]
                    )
                    |> Data.addVarName "varName" x
                    |> Data.addRange "range" opRange
                    |> Data.addRange "arg1" argRange1
                    |> Data.addRange "arg2" argRange2
                )
                    :: context

        _ ->
            context
