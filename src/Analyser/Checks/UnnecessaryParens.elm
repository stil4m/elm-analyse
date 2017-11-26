module Analyser.Checks.UnnecessaryParens exposing (checker)

import AST.Util exposing (getParenthesized, isCase, isIf, isLambda, isLet, isOperatorApplication)
import ASTUtil.Inspector as Inspector exposing (Order(Post), defaultConfig)
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Range as Range exposing (RangeContext)
import Analyser.Messages.Schema as Schema
import Elm.Syntax.Expression exposing (..)
import Elm.Syntax.Infix exposing (..)
import Elm.Syntax.Range as Syntax
import List.Extra as List
import Maybe.Extra as Maybe


checker : Checker
checker =
    { check = scan
    , info =
        { key = "UnnecessaryParens"
        , name = "Unnecessary Parens"
        , description = "If you want parenthesis, then you might want to look into Lisp."
        , schema =
            Schema.schema
                |> Schema.rangeProp "range"
        }
    }


type alias Context =
    List Syntax.Range


scan : RangeContext -> FileContext -> Configuration -> List MessageData
scan rangeContext fileContext _ =
    let
        x : Context
        x =
            Inspector.inspect
                { defaultConfig | onExpression = Post onExpression, onFunction = Post onFunction, onLambda = Post onLambda }
                fileContext.ast
                []
    in
    x
        |> List.uniqueBy toString
        |> List.map (Range.build rangeContext >> buildMessage)


buildMessage : Range.Range -> MessageData
buildMessage r =
    Data.init
        (String.concat
            [ "Unnecessary parens at "
            , Range.asString r
            ]
        )
        |> Data.addRange "range" r


onFunction : Function -> Context -> Context
onFunction function context =
    case function.declaration.expression of
        ( range, ParenthesizedExpression _ ) ->
            range :: context

        _ ->
            context


onLambda : Lambda -> Context -> Context
onLambda lambda context =
    case lambda.expression of
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

        ListExpr x ->
            onListExpr x context

        _ ->
            context


onListExpr : List Expression -> Context -> Context
onListExpr exprs context =
    List.filterMap getParenthesized exprs
        |> List.map Tuple.first
        |> flip (++) context


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
        |> Maybe.filter (Tuple.second >> isCase >> not)
        |> Maybe.map Tuple.first
        |> Maybe.map (flip (::) context)
        |> Maybe.withDefault context


onOperatorApplication : ( String, InfixDirection, Expression, Expression ) -> Context -> Context
onOperatorApplication ( _, _, left, right ) context =
    let
        fixHandSide =
            getParenthesized
                >> Maybe.filter (Tuple.second >> operatorHandSideAllowedParens >> not)
                >> Maybe.map Tuple.first
    in
    [ fixHandSide left
    , fixHandSide right
    ]
        |> List.filterMap identity
        |> flip (++) context


operatorHandSideAllowedParens : Expression -> Bool
operatorHandSideAllowedParens expr =
    List.any ((|>) expr)
        [ isOperatorApplication, isIf, isCase, isLet, isLambda ]


onParenthesizedExpression : Syntax.Range -> Expression -> Context -> Context
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

        QualifiedExpr _ _ ->
            range :: context

        _ ->
            context
