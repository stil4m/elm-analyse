module Analyser.Checks.NoDebug exposing (scan)

import AST.Types exposing (Expression, InnerExpression(QualifiedExpr))
import AST.Ranges exposing (Range)
import Analyser.Files.FileContext exposing (FileContext)
import Analyser.Messages.Types exposing (Message, MessageData(DebugLog, DebugCrash), newMessage)
import Inspector exposing (Order(Post), defaultConfig)


type DebugType
    = Log
    | Crash


type alias Context =
    List ( DebugType, Range )


scan : FileContext -> List Message
scan fileContext =
    Inspector.inspect
        { defaultConfig | onExpression = Post onExpression }
        fileContext.ast
        []
        |> List.map (asMessage fileContext.path)
        |> List.map (newMessage [ ( fileContext.sha1, fileContext.path ) ])


asMessage : String -> ( DebugType, Range ) -> MessageData
asMessage path ( debugType, range ) =
    case debugType of
        Log ->
            DebugLog path range

        Crash ->
            DebugCrash path range


onExpression : Expression -> Context -> Context
onExpression ( range, expression ) context =
    case expression of
        QualifiedExpr moduleName f ->
            entryForQualifiedExpr moduleName f
                |> Maybe.map (flip (,) range >> flip (::) context)
                |> Maybe.withDefault context

        _ ->
            context


entryForQualifiedExpr : List String -> String -> Maybe DebugType
entryForQualifiedExpr moduleName f =
    if moduleName == [ "Debug" ] then
        if f == "log" then
            Just Log
        else if f == "crash" then
            Just Crash
        else
            Nothing
    else
        Nothing
