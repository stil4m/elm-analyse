module Analyser.Checks.UnnecessaryListConcat exposing (scan)

import AST.Types exposing (File, Case, LetBlock, VariablePointer, Destructuring, Pattern, Function, Lambda, Exposure, ModuleName, Expression, InnerExpression(Application, ListExpr, QualifiedExpr))
import AST.Ranges exposing (Range)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Types exposing (Message, MessageData(UnnecessaryListConcat), newMessage)
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
        |> List.map (UnnecessaryListConcat fileContext.path)
        |> List.map (newMessage [ ( fileContext.sha1, fileContext.path ) ])


isListExpression : Expression -> Bool
isListExpression ( _, inner ) =
    case inner of
        ListExpr x ->
            True

        _ ->
            False


onExpression : Expression -> Context -> Context
onExpression ( r, inner ) context =
    case inner of
        Application [ ( _, QualifiedExpr [ "List" ] "concat" ), ( _, ListExpr args ) ] ->
            if List.all isListExpression args then
                r :: context
            else
                context

        _ ->
            context
