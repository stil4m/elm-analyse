module Analyser.Checks.NoUncurriedPrefix exposing (scan)

import AST.Types exposing (InnerExpression(Application, PrefixOperator), Expression)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Types  exposing (MessageData(NoUnurriedPrefix))
import Inspector exposing (Action(Post), defaultConfig)
import AST.Ranges exposing (Range)


type alias Context =
    List ( String, Range )


scan : FileContext -> List MessageData
scan fileContext =
    Inspector.inspect
        { defaultConfig
            | onExpression = Post onExpression
        }
        fileContext.ast
        []
        |> List.map (uncurry (NoUnurriedPrefix fileContext.path))


onExpression : Expression -> Context -> Context
onExpression ( _, expression ) context =
    case expression of
        Application xs ->
            case xs of
                [ ( r, PrefixOperator x ), _, _ ] ->
                    ( x, r ) :: context

                _ ->
                    context

        _ ->
            context
