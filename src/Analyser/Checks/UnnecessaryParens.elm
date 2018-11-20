module Analyser.Checks.UnnecessaryParens exposing (checker)

import AST.Ranges as Range
import ASTUtil.Inspector as Inspector exposing (Order(..), defaultConfig)
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Schema as Schema
import Elm.Syntax.Expression as Expression exposing (CaseBlock, Expression(..), Function, Lambda, RecordSetter)
import Elm.Syntax.Node as Node exposing (Node(..))
import Elm.Syntax.Range as Syntax exposing (Range)
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


scan : FileContext -> Configuration -> List MessageData
scan fileContext _ =
    let
        x : Context
        x =
            Inspector.inspect
                { defaultConfig | onExpression = Post onExpression, onFunction = Post onFunction, onLambda = Post onLambda }
                fileContext.ast
                []
    in
    x
        |> List.uniqueBy rangeToString
        |> List.map buildMessage


rangeToString : Range -> String
rangeToString range =
    String.join "|"
        [ String.fromInt range.start.row
        , String.fromInt range.start.column
        , String.fromInt range.end.row
        , String.fromInt range.end.column
        ]


buildMessage : Range -> MessageData
buildMessage r =
    Data.init
        (String.concat
            [ "Unnecessary parens at "
            , Range.rangeToString r
            ]
        )
        |> Data.addRange "range" r


onFunction : Node Function -> Context -> Context
onFunction (Node _ function) context =
    case (Node.value function.declaration).expression of
        Node range (ParenthesizedExpression _) ->
            range :: context

        _ ->
            context


onLambda : Lambda -> Context -> Context
onLambda lambda context =
    case lambda.expression of
        Node range (ParenthesizedExpression _) ->
            range :: context

        _ ->
            context


onExpression : Node Expression -> Context -> Context
onExpression (Node range expression) context =
    case expression of
        ParenthesizedExpression inner ->
            onParenthesizedExpression range inner context

        OperatorApplication _ _ left right ->
            onOperatorApplication left right context

        Application parts ->
            onApplication parts context

        IfBlock a b c ->
            onIfBlock a b c context

        CaseExpression caseBlock ->
            onCaseBlock caseBlock context

        RecordExpr parts ->
            onRecord parts context

        RecordUpdateExpression _ updates ->
            onRecord updates context

        TupledExpression x ->
            onTuple x context

        ListExpr x ->
            onListExpr x context

        _ ->
            context


onListExpr : List (Node Expression) -> Context -> Context
onListExpr exprs context =
    List.filterMap getParenthesized exprs
        |> List.map Tuple.first
        |> (\a -> a ++ context)


onTuple : List (Node Expression) -> Context -> Context
onTuple exprs context =
    List.filterMap getParenthesized exprs
        |> List.map Tuple.first
        |> (\a -> a ++ context)


onRecord : List (Node RecordSetter) -> Context -> Context
onRecord setters context =
    setters
        |> List.filterMap (Node.value >> Tuple.second >> getParenthesized)
        |> List.map Tuple.first
        |> (\a -> a ++ context)


onCaseBlock : CaseBlock -> Context -> Context
onCaseBlock caseBlock context =
    case getParenthesized caseBlock.expression of
        Just ( range, _ ) ->
            range :: context

        Nothing ->
            context


onIfBlock : Node Expression -> Node Expression -> Node Expression -> Context -> Context
onIfBlock clause thenBranch elseBranch context =
    [ clause, thenBranch, elseBranch ]
        |> List.filterMap getParenthesized
        |> List.map Tuple.first
        |> (\a -> a ++ context)


onApplication : List (Node Expression) -> Context -> Context
onApplication parts context =
    List.head parts
        |> Maybe.andThen getParenthesized
        |> Maybe.filter (Tuple.second >> Node.value >> Expression.isOperatorApplication >> not)
        |> Maybe.filter (Tuple.second >> Node.value >> Expression.isCase >> not)
        |> Maybe.filter (Tuple.second >> Node.value >> Expression.isLambda >> not)
        |> Maybe.map Tuple.first
        |> Maybe.map (\a -> a :: context)
        |> Maybe.withDefault context


onOperatorApplication : Node Expression -> Node Expression -> Context -> Context
onOperatorApplication left right context =
    let
        fixHandSide : Node Expression -> Maybe Syntax.Range
        fixHandSide =
            getParenthesized
                >> Maybe.filter (Tuple.second >> operatorHandSideAllowedParens >> not)
                >> Maybe.map Tuple.first
    in
    [ fixHandSide left
    , fixHandSide right
    ]
        |> List.filterMap identity
        |> (\a -> a ++ context)


operatorHandSideAllowedParens : Node Expression -> Bool
operatorHandSideAllowedParens (Node _ expr) =
    List.any ((|>) expr)
        [ Expression.isOperatorApplication, Expression.isIfElse, Expression.isCase, Expression.isLet, Expression.isLambda ]


onParenthesizedExpression : Syntax.Range -> Node Expression -> Context -> Context
onParenthesizedExpression range (Node _ expression) context =
    case expression of
        RecordAccess _ _ ->
            range :: context

        RecordAccessFunction _ ->
            range :: context

        RecordUpdateExpression _ _ ->
            range :: context

        RecordExpr _ ->
            range :: context

        TupledExpression _ ->
            range :: context

        ListExpr _ ->
            range :: context

        FunctionOrValue _ _ ->
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


getParenthesized : Node Expression -> Maybe ( Range, Node Expression )
getParenthesized (Node r e) =
    case e of
        ParenthesizedExpression p ->
            Just ( r, p )

        _ ->
            Nothing
