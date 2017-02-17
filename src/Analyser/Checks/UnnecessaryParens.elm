module Analyser.Checks.UnnecessaryParens exposing (scan)

import AST.Types
    exposing
        ( Expression
        , InnerExpression
            ( ListExpr
            , ParenthesizedExpression
            , OperatorApplication
            , FunctionOrValue
            , Integer
            , TupledExpression
            , Floatable
            , Literal
            , CharLiteral
            , Application
            , IfBlock
            , RecordExpr
            , RecordUpdateExpression
            , RecordAccessFunction
            , RecordAccess
            , CaseExpression
            )
        , InfixDirection
        , Function
        , CaseBlock
        , File
        )
import AST.Ranges exposing (Range)
import AST.Util exposing (getParenthesized, isOperatorApplication, isLambda, isIf, isCase)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Types exposing (Message, MessageData(UnnecessaryParens), newMessage)
import Inspector exposing (Action(Post), defaultConfig)
import Maybe.Extra as Maybe
import List.Extra as List


type alias Context =
    List Range


rangetoTuple : Range -> ( Int, Int, Int, Int )
rangetoTuple x =
    ( x.start.row, x.start.column, x.end.row, x.end.column )


scan : FileContext -> List Message
scan fileContext =
    let
        x : Context
        x =
            Inspector.inspect
                { defaultConfig | onExpression = Post onExpression, onFunction = Post onFunction }
                fileContext.ast
                []
    in
        x
            |> List.uniqueBy rangetoTuple
            |> List.map (UnnecessaryParens fileContext.path)
            |> List.map (newMessage [ ( fileContext.sha1, fileContext.path ) ])


onFunction : Function -> Context -> Context
onFunction function context =
    case function.declaration.expression of
        ( range, ParenthesizedExpression _ ) ->
            range :: context

        _ ->
            context


onExpression : Expression -> Context -> Context
onExpression ( range, expression ) context =
    case expression of
        ParenthesizedExpression inner ->
            onParenthesizedExpression range inner context

        OperatorApplication op dir left right ->
            onOperatorApplication ( op, dir, left, right ) context

        Application parts ->
            onApplication parts context

        IfBlock a b c ->
            onIfBlock a b c context

        CaseExpression caseBlock ->
            onCaseBlock caseBlock context

        RecordExpr parts ->
            onRecord parts context

        RecordUpdateExpression recordUpdate ->
            onRecord recordUpdate.updates context

        TupledExpression x ->
            onTuple x context

        _ ->
            context


onTuple : List Expression -> Context -> Context
onTuple exprs context =
    List.filterMap getParenthesized exprs
        |> List.map Tuple.first
        |> flip (++) context


onRecord : List ( String, Expression ) -> Context -> Context
onRecord fields context =
    fields
        |> List.filterMap (Tuple.second >> getParenthesized)
        |> List.map Tuple.first
        |> flip (++) context


onCaseBlock : CaseBlock -> Context -> Context
onCaseBlock caseBlock context =
    case getParenthesized caseBlock.expression of
        Just ( range, _ ) ->
            range :: context

        Nothing ->
            context


onIfBlock : Expression -> Expression -> Expression -> Context -> Context
onIfBlock clause thenBranch elseBranch context =
    [ clause, thenBranch, elseBranch ]
        |> List.filterMap getParenthesized
        |> List.map Tuple.first
        |> flip (++) context


onApplication : List Expression -> Context -> Context
onApplication parts context =
    List.head parts
        |> Maybe.andThen getParenthesized
        |> Maybe.filter (Tuple.second >> isOperatorApplication >> not)
        |> Maybe.map Tuple.first
        |> Maybe.map (flip (::) context)
        |> Maybe.withDefault context


onOperatorApplication : ( String, InfixDirection, Expression, Expression ) -> Context -> Context
onOperatorApplication ( _, _, left, right ) context =
    let
        fixHandSide f =
            getParenthesized
                >> Maybe.filter (Tuple.second >> isOperatorApplication >> not)
                >> Maybe.filter (Tuple.second >> f)
                >> Maybe.map Tuple.first
    in
        [ fixHandSide allowedOnLHS left
        , fixHandSide (always True) right
        ]
            |> List.filterMap identity
            |> flip (++) context


allowedOnLHS : Expression -> Bool
allowedOnLHS expr =
    List.all ((|>) expr)
        [ (isLambda >> not)
        , (isCase >> not)
        , (isIf >> not)
        ]


onParenthesizedExpression : Range -> Expression -> Context -> Context
onParenthesizedExpression range expression context =
    case Tuple.second expression of
        RecordAccess _ _ ->
            range :: context

        RecordAccessFunction _ ->
            range :: context

        RecordUpdateExpression _ ->
            range :: context

        RecordExpr _ ->
            range :: context

        TupledExpression _ ->
            range :: context

        ListExpr _ ->
            range :: context

        FunctionOrValue _ ->
            range :: context

        Integer _ ->
            range :: context

        Floatable _ ->
            range :: context

        CharLiteral _ ->
            range :: context

        Literal _ ->
            range :: context

        _ ->
            context
