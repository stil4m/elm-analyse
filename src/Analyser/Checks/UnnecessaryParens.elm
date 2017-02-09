module Analyser.Checks.UnnecessaryParens exposing (scan)

import AST.Types
    exposing
        ( Expression
        , InnerExpression
            ( ListExpr
            , ParenthesizedExpression
            , OperatorApplicationExpression
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
        , CaseBlock
        , File
        , OperatorApplication
        )
import AST.Ranges exposing (Range)
import AST.Util exposing (getParenthesized, isOperatorApplication, isLambda, isIf, isCase)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages exposing (Message(UnnecessaryParens))
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
                { defaultConfig | onExpression = Post onExpression }
                fileContext.ast
                []
    in
        x
            |> List.uniqueBy rangetoTuple
            |> List.map (UnnecessaryParens fileContext.path)


onExpression : Expression -> Context -> Context
onExpression ( range, expression ) context =
    case expression of
        ParenthesizedExpression inner ->
            onParenthesizedExpression range inner context

        OperatorApplicationExpression inner ->
            onOperatorApplicationExpression inner context

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

        _ ->
            context


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


onOperatorApplicationExpression : OperatorApplication -> Context -> Context
onOperatorApplicationExpression oparatorApplication context =
    let
        fixHandSide f =
            getParenthesized
                >> Maybe.filter (Tuple.second >> isOperatorApplication >> not)
                >> Maybe.filter (Tuple.second >> f)
                >> Maybe.map Tuple.first
    in
        [ fixHandSide allowedOnLHS oparatorApplication.left
        , fixHandSide (always True) oparatorApplication.right
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
