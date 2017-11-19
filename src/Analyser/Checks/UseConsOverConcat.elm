module Analyser.Checks.UseConsOverConcat exposing (checker)

import ASTUtil.Inspector as Inspector exposing (Order(Post), defaultConfig)
import Analyser.Checks.Base exposing (Checker, keyBasedChecker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Range as Range exposing (Range, RangeContext)
import Analyser.Messages.Types exposing (Message, MessageData(UseConsOverConcat), newMessage)
import Elm.Syntax.Expression exposing (..)


checker : Checker
checker =
    { check = scan
    , shouldCheck = keyBasedChecker [ "UseConsOverConcat" ]
    , key = "UseConsOverConcat"
    , name = "Use Cons Over Concat"
    , description = "If you concatenate two lists, but the right hand side is a single element list, then you should use the cons operator."
    }


type alias Context =
    List Range


scan : RangeContext -> FileContext -> Configuration -> List Message
scan rangeContext fileContext _ =
    Inspector.inspect
        { defaultConfig
            | onExpression = Post (onExpression rangeContext)
        }
        fileContext.ast
        []
        |> List.map (UseConsOverConcat fileContext.path)
        |> List.map (newMessage [ ( fileContext.sha1, fileContext.path ) ])


onExpression : RangeContext -> Expression -> Context -> Context
onExpression rangeContext ( r, inner ) context =
    case inner of
        OperatorApplication "++" _ ( _, ListExpr [ _ ] ) _ ->
            Range.build rangeContext r :: context

        _ ->
            context
