module Analyser.Checks.UseConsOverConcat exposing (scan)

import AST.Types exposing (File, Case, LetBlock, VariablePointer, Destructuring, Pattern, Function, Lambda, Exposure, ModuleName, Expression, InnerExpression(OperatorApplication, ListExpr))
import AST.Ranges exposing (Range)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Types exposing (Message, MessageData(UseConsOverConcat), newMessage)
import Inspector exposing (Order(Post), defaultConfig)


type alias Context =
    List Range


scan : FileContext -> List Message
scan fileContext =
    Inspector.inspect
        { defaultConfig
            | onExpression = Post onExpression
        }
        fileContext.ast
        []
        |> List.map (UseConsOverConcat fileContext.path)
        |> List.map (newMessage [ ( fileContext.sha1, fileContext.path ) ])


onExpression : Expression -> Context -> Context
onExpression ( r, inner ) context =
    case inner of
        OperatorApplication "++" _ ( _, ListExpr [ _ ] ) ( _, ListExpr _ ) ->
            r :: context

        _ ->
            context
