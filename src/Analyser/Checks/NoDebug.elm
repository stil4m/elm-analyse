module Analyser.Checks.NoDebug exposing (scan)

import AST.Types exposing (Expression, InnerExpression(QualifiedExpr))
import AST.Ranges exposing (Range)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages exposing (Message(DebugLog, DebugCrash))
import Inspector exposing (Action(Inner, Post, Pre), defaultConfig)


type DebugType
    = Log
    | Crash


type alias Context =
    List ( DebugType, Range )


scan : FileContext -> List Message
scan fileContext =
    Inspector.inspect
        { defaultConfig
            | onExpression = Post onExpression
        }
        fileContext.ast
        []
        |> List.map
            (\( t, r ) ->
                case t of
                    Log ->
                        DebugLog fileContext.path r

                    Crash ->
                        DebugCrash fileContext.path r
            )


onExpression : Expression -> Context -> Context
onExpression ( range, expression ) context =
    case expression of
        QualifiedExpr moduleName f ->
            if moduleName == [ "Debug" ] then
                if f == "log" then
                    ( Log, range ) :: context
                else if f == "crash" then
                    ( Crash, range ) :: context
                else
                    context
            else
                context

        _ ->
            context
