module Parser.CombineTestUtil exposing (..)

import Combine exposing (..)
import AST.Types exposing (..)
import AST.Ranges exposing (emptyRange)
import Tuple2


parseFullStringState : State -> String -> Parser State b -> Maybe b
parseFullStringState state s p =
    case Combine.runParser (p <* Combine.end) state s of
        Ok ( _, _, r ) ->
            Just r

        _ ->
            Nothing


parseFullStringWithNullState : String -> Parser State b -> Maybe b
parseFullStringWithNullState s p =
    case Combine.runParser (p <* Combine.end) emptyState s of
        Ok ( _, _, r ) ->
            Just r

        _ ->
            Nothing


parseFullString : String -> Parser () b -> Maybe b
parseFullString s p =
    case Combine.parse (p <* Combine.end) s of
        Ok ( _, _, r ) ->
            Just r

        _ ->
            Nothing


emptyRanged : InnerExpression -> Expression
emptyRanged =
    (,) emptyRange


noRangeExpression : Expression -> Expression
noRangeExpression ( _, inner ) =
    ( emptyRange, noRangeInnerExpression inner )


noRangeDeclaration : Declaration -> Declaration
noRangeDeclaration decl =
    case decl of
        DestructuringDeclaration d ->
            DestructuringDeclaration { d | expression = noRangeExpression d.expression }

        FuncDecl f ->
            FuncDecl <| noRangeFunction f

        _ ->
            decl


noRangeFunction : Function -> Function
noRangeFunction f =
    { f | declaration = noRangeFunctionDeclaration f.declaration }


noRangeFunctionDeclaration : FunctionDeclaration -> FunctionDeclaration
noRangeFunctionDeclaration d =
    { d | expression = noRangeExpression d.expression }


noRangeInnerExpression : InnerExpression -> InnerExpression
noRangeInnerExpression inner =
    case inner of
        Application xs ->
            Application <| List.map noRangeExpression xs

        OperatorApplicationExpression app ->
            OperatorApplicationExpression { app | left = noRangeExpression app.left, right = noRangeExpression app.right }

        ListExpr xs ->
            ListExpr <| List.map noRangeExpression xs

        IfBlock a b c ->
            IfBlock
                (noRangeExpression a)
                (noRangeExpression b)
                (noRangeExpression c)

        RecordExpr fields ->
            RecordExpr <| List.map (Tuple2.mapSecond noRangeExpression) fields

        LambdaExpression lambda ->
            LambdaExpression { lambda | expression = noRangeExpression lambda.expression }

        RecordUpdateExpression update ->
            RecordUpdateExpression { update | updates = List.map (Tuple2.mapSecond noRangeExpression) update.updates }

        CaseExpression { cases, expression } ->
            CaseExpression
                { cases = List.map (Tuple2.mapSecond noRangeExpression) cases
                , expression = noRangeExpression expression
                }

        LetExpression { declarations, expression } ->
            LetExpression
                { declarations = List.map noRangeDeclaration declarations
                , expression = noRangeExpression expression
                }

        TupledExpression x ->
            TupledExpression <| List.map noRangeExpression x

        ParenthesizedExpression x ->
            ParenthesizedExpression <| noRangeExpression x

        _ ->
            inner
