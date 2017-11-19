module Analyser.Checks.NoUncurriedPrefix exposing (checker)

import ASTUtil.Inspector as Inspector exposing (Order(Post), defaultConfig)
import Analyser.Checks.Base exposing (Checker, keyBasedChecker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Range as Range exposing (Range, RangeContext)
import Analyser.Messages.Types exposing (Message, MessageData(NoUncurriedPrefix), newMessage)
import Elm.Syntax.Expression exposing (..)


checker : Checker
checker =
    { check = scan
    , shouldCheck = keyBasedChecker [ "NoUncurriedPrefix" ]
    , key = "NoUncurriedPrefix"
    , name = "Fully Applied Operator as Prefix"
    , description = "It's not needed to use an operator in prefix notation when you apply both arguments directly."
    }


type alias Context =
    List ( String, Range )


scan : RangeContext -> FileContext -> Configuration -> List Message
scan rangeContext fileContext _ =
    Inspector.inspect
        { defaultConfig
            | onExpression = Post (onExpression rangeContext)
        }
        fileContext.ast
        []
        |> List.map (uncurry (NoUncurriedPrefix fileContext.path))
        |> List.map (newMessage [ ( fileContext.sha1, fileContext.path ) ])


onExpression : RangeContext -> Expression -> Context -> Context
onExpression rangeContext ( _, expression ) context =
    case expression of
        Application xs ->
            case xs of
                [ ( r, PrefixOperator x ), _, _ ] ->
                    if String.startsWith ",," x then
                        context
                    else
                        ( x, Range.build rangeContext r ) :: context

                _ ->
                    context

        _ ->
            context
