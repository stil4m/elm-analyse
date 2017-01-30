module Analyser.Checks.UnnecessaryParens exposing (scan)

import AST.Types exposing (Exposure(All, Explicit, None), Expose(TypeExpose), Expression(ParenthesizedExpression, OperatorApplicationExpression, FunctionOrValue, Integer, Floatable, Literal, CharLiteral), Parenthesized, File, Range, OperatorApplication)
import AST.Util exposing (getParenthesized, isOperatorApplication)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages exposing (Message(UnnecessaryParens))
import Inspector exposing (Action(Post), defaultConfig)
import Maybe.Extra as Maybe
import List.Extra as List


type alias UnnecessaryParensContext =
    List Range


rangetoTuple : Range -> ( Int, Int, Int, Int )
rangetoTuple x =
    ( x.start.row, x.start.column, x.end.row, x.end.column )


scan : FileContext -> List Message
scan fileContext =
    let
        x : List Range
        x =
            Inspector.inspect
                { defaultConfig | onExpression = Post onExpression }
                fileContext.ast
                []
    in
        x
            |> List.uniqueBy rangetoTuple
            |> List.map (UnnecessaryParens fileContext.path)


onExpression : Expression -> UnnecessaryParensContext -> UnnecessaryParensContext
onExpression expression context =
    case expression of
        ParenthesizedExpression inner ->
            onParenthesizedExpression inner context

        OperatorApplicationExpression inner ->
            onOperatorApplicationExpression inner context

        _ ->
            context


onOperatorApplicationExpression : OperatorApplication -> UnnecessaryParensContext -> UnnecessaryParensContext
onOperatorApplicationExpression oparatorApplication context =
    let
        fixHandSide =
            getParenthesized
                >> Maybe.filter (.expression >> isOperatorApplication >> not)
                >> Maybe.map .range
    in
        [ fixHandSide oparatorApplication.left
        , fixHandSide oparatorApplication.right
        ]
            |> List.filterMap identity
            |> (flip (++) context)


onParenthesizedExpression : Parenthesized -> UnnecessaryParensContext -> UnnecessaryParensContext
onParenthesizedExpression { expression, range } context =
    case expression of
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
