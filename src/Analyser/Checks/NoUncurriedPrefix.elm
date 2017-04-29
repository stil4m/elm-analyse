module Analyser.Checks.NoUncurriedPrefix exposing (checker)

import AST.Types exposing (InnerExpression(Application, PrefixOperator), Expression)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Types exposing (Message, MessageData(NoUncurriedPrefix), newMessage)
import ASTUtil.Inspector as Inspector exposing (Order(Post), defaultConfig)
import AST.Ranges exposing (Range)
import Analyser.Configuration exposing (Configuration)
import Analyser.Checks.Base exposing (Checker, keyBasedChecker)


checker : Checker
checker =
    { check = scan
    , shouldCheck = keyBasedChecker [ "NoUncurriedPrefix" ]
    }


type alias Context =
    List ( String, Range )


scan : FileContext -> Configuration -> List Message
scan fileContext _ =
    Inspector.inspect
        { defaultConfig
            | onExpression = Post onExpression
        }
        fileContext.ast
        []
        |> List.map (uncurry (NoUncurriedPrefix fileContext.path))
        |> List.map (newMessage [ ( fileContext.sha1, fileContext.path ) ])


onExpression : Expression -> Context -> Context
onExpression ( _, expression ) context =
    case expression of
        Application xs ->
            case xs of
                [ ( r, PrefixOperator x ), _, _ ] ->
                    if String.startsWith ",," x then
                        context
                    else
                        ( x, r ) :: context

                _ ->
                    context

        _ ->
            context
