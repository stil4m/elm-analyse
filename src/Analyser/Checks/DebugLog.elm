module Analyser.Checks.DebugLog exposing (checker)

import ASTUtil.Inspector as Inspector exposing (Order(Post), defaultConfig)
import Analyser.Checks.Base exposing (Checker, keyBasedChecker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Range as Range exposing (Range, RangeContext)
import Analyser.Messages.Types exposing (Message, MessageData(DebugLog), newMessage)
import Elm.Syntax.Expression exposing (..)


checker : Checker
checker =
    { check = scan
    , shouldCheck = keyBasedChecker [ "DebugLog" ]
    , key = "DebugLog"
    , name = "Debug Log"
    , description = "This is nice for development, but you do not want to ship this to package users or your end users."
    }


type alias Context =
    List Range


scan : RangeContext -> FileContext -> Configuration -> List Message
scan rangeContext fileContext _ =
    Inspector.inspect
        { defaultConfig | onExpression = Post (onExpression rangeContext) }
        fileContext.ast
        []
        |> List.map (DebugLog fileContext.path)
        |> List.map (newMessage [ ( fileContext.sha1, fileContext.path ) ])


onExpression : RangeContext -> Expression -> Context -> Context
onExpression rangeContext ( range, expression ) context =
    case expression of
        QualifiedExpr moduleName f ->
            if entryForQualifiedExpr moduleName f then
                Range.build rangeContext range :: context
            else
                context

        _ ->
            context


entryForQualifiedExpr : List String -> String -> Bool
entryForQualifiedExpr moduleName f =
    if moduleName == [ "Debug" ] then
        if f == "log" then
            True
        else
            False
    else
        False
