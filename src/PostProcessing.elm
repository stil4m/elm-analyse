module PostProcessing exposing (..)

import Dict exposing (Dict)
import List exposing (maximum)
import AST.Types exposing (..)
import List.Extra as List


type alias Operators =
    Dict String ( Int, InfixDirection )


postProcess : File -> File
postProcess file =
    visit
        { onExpression =
            Just
                (\context inner expression ->
                    case inner expression of
                        Application args ->
                            fixApplication context args

                        _ ->
                            expression
                )
        }
        (Dict.fromList
            [ ( "|>", ( 0, Left ) ) ]
        )
        file


fixApplication : Operators -> List Expression -> Expression
fixApplication operators expressions =
    let
        ops =
            (List.filterMap expressionOperators expressions)
                |> List.map (\x -> ( x, Dict.get x operators |> Maybe.withDefault ( 9, Left ) ))
                |> highestPrecedence

        fixExprs exps =
            case exps of
                [ x ] ->
                    x

                _ ->
                    Application exps

        doTheThing exps =
            if Dict.isEmpty ops then
                fixExprs exps
            else
                findNextSplit ops exps
                    |> Maybe.map (\( p, o, s ) -> OperatorApplication o (doTheThing p) (doTheThing s))
                    |> Maybe.withDefault (fixExprs exps)
    in
        doTheThing expressions


findNextSplit : Dict String ( Int, InfixDirection ) -> List Expression -> Maybe ( List Expression, InfixDirection, List Expression )
findNextSplit dict exps =
    let
        prefix =
            exps
                |> List.takeWhile
                    (\x ->
                        expressionOperators x
                            |> Maybe.andThen (flip Dict.get dict)
                            |> (==) Nothing
                    )

        suffix =
            List.drop (List.length prefix + 1) exps
    in
        if List.isEmpty suffix then
            Nothing
        else
            Just ( prefix, Left, suffix )


highestPrecedence : List ( String, ( Int, InfixDirection ) ) -> Dict String ( Int, InfixDirection )
highestPrecedence input =
    let
        maxi =
            input
                |> List.map (Tuple.second >> Tuple.first)
                |> maximum
    in
        maxi
            |> Maybe.map (\m -> List.filter (Tuple.second >> Tuple.first >> (==) m) input)
            |> Maybe.withDefault []
            |> Dict.fromList


expressionOperators : Expression -> Maybe String
expressionOperators expression =
    case expression of
        Operator s ->
            Just s

        _ ->
            Nothing


type alias Visitor a =
    { onExpression : Maybe (a -> (Expression -> Expression) -> Expression -> Expression) }


visit : Visitor context -> context -> File -> File
visit visitor context file =
    let
        newDeclarations =
            visitDeclarations visitor context file.declarations
    in
        { file
            | declarations = newDeclarations
        }


visitDeclarations : Visitor context -> context -> List Declaration -> List Declaration
visitDeclarations visitor context declarations =
    List.map (visitDeclaration visitor context) declarations


visitDeclaration : Visitor context -> context -> Declaration -> Declaration
visitDeclaration visitor context declaration =
    case declaration of
        FuncDecl function ->
            FuncDecl (visitFunctionDecl visitor context function)

        _ ->
            declaration


visitFunctionDecl : Visitor context -> context -> Function -> Function
visitFunctionDecl visitor context function =
    let
        newFunctionDeclaration =
            visitFunctionDeclaration visitor context function.declaration
    in
        { function | declaration = newFunctionDeclaration }


visitFunctionDeclaration : Visitor context -> context -> FunctionDeclaration -> FunctionDeclaration
visitFunctionDeclaration visitor context functionDeclaration =
    let
        newExpression =
            visitExpression visitor context functionDeclaration.expression
    in
        functionDeclaration


visitExpression : Visitor context -> context -> Expression -> Expression
visitExpression visitor context expression =
    let
        inner =
            visitExpressionInner visitor context
    in
        (visitor.onExpression |> Maybe.withDefault (\context inner expr -> inner expr))
            context
            inner
            expression


visitExpressionInner : Visitor context -> context -> Expression -> Expression
visitExpressionInner visitor context expression =
    case expression of
        UnitExpr ->
            expression

        Application expressionList ->
            expressionList
                |> List.map (visitExpression visitor context)
                |> Application

        OperatorApplication dir e1 e2 ->
            expression

        FunctionOrValue string ->
            expression

        IfBlock expression expression2 expression3 ->
            expression

        PrefixOperator string ->
            expression

        Operator string ->
            expression

        Integer int ->
            expression

        Floatable float ->
            expression

        Literal string ->
            expression

        CharLiteral char ->
            expression

        TupledExpression expressionList ->
            expression

        Parentesized expression ->
            expression

        LetBlock declarationList expression ->
            expression

        CaseBlock expression cases ->
            expression

        Lambda patternList expression ->
            expression

        RecordExpr expressionStringList ->
            expression

        ListExpr expressionList ->
            expression

        QualifiedExpr moduleName string ->
            expression

        RecordAccess stringList ->
            expression

        RecordAccessFunction s ->
            expression

        RecordUpdate string expressionStringList ->
            expression

        GLSLExpression string ->
            expression
