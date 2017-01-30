module Inspector exposing (Action(Skip, Continue, Pre, Post, Inner), Config, defaultConfig, inspect)

import AST.Types exposing (File, Declaration(TypeDecl, FuncDecl, AliasDecl, PortDeclaration, InfixDeclaration, DestructuringDeclaration), Function, Destructuring, Expression, InnerExpression(..), Lambda, LetBlock, Case, RecordUpdate, OperatorApplication)


type Action context x
    = Skip
    | Continue
    | Pre (x -> context -> context)
    | Post (x -> context -> context)
    | Inner ((context -> context) -> x -> context -> context)


type alias Config context =
    { onFile : Action context File
    , onDeclaration : Action context Declaration
    , onFunction : Action context Function
    , onDestructuring : Action context Destructuring
    , onExpression : Action context Expression
    , onOperatorApplication : Action context OperatorApplication
    , onLambda : Action context Lambda
    , onLetBlock : Action context LetBlock
    , onCase : Action context Case
    , onFunctionOrValue : Action context String
    , onRecordAccess : Action context (List String)
    , onRecordUpdate : Action context RecordUpdate
    }


defaultConfig : Config x
defaultConfig =
    { onFile = Continue
    , onDeclaration = Continue
    , onFunction = Continue
    , onDestructuring = Continue
    , onExpression = Continue
    , onLambda = Continue
    , onOperatorApplication = Continue
    , onLetBlock = Continue
    , onCase = Continue
    , onFunctionOrValue = Continue
    , onRecordAccess = Continue
    , onRecordUpdate = Continue
    }


actionLambda : Action config x -> (config -> config) -> x -> config -> config
actionLambda act =
    case act of
        Skip ->
            (\_ _ c -> c)

        Continue ->
            (\f _ c -> f c)

        Pre g ->
            (\f x c -> g x c |> f)

        Post g ->
            (\f x c -> f c |> g x)

        Inner g ->
            (\f x c -> g f x c)


inspect : Config a -> File -> a -> a
inspect config file context =
    actionLambda config.onFile
        (inspectDeclarations config file.declarations)
        file
        context


inspectDeclarations : Config context -> List Declaration -> context -> context
inspectDeclarations config declarations context =
    List.foldl (inspectDeclaration config) context declarations


inspectDeclaration : Config context -> Declaration -> context -> context
inspectDeclaration config declaration context =
    case declaration of
        FuncDecl function ->
            inspectFunction config function context

        AliasDecl _ ->
            --TODO
            context

        TypeDecl _ ->
            --TODO
            context

        PortDeclaration _ ->
            --TODO
            context

        InfixDeclaration _ ->
            --TODO
            context

        DestructuringDeclaration destructing ->
            inspectDestructuring config destructing context


inspectDestructuring : Config context -> Destructuring -> context -> context
inspectDestructuring config destructuring context =
    actionLambda
        config.onDestructuring
        (inspectExpression config destructuring.expression)
        destructuring
        context


inspectFunction : Config context -> Function -> context -> context
inspectFunction config function context =
    actionLambda
        config.onFunction
        (inspectExpression config function.declaration.expression)
        function
        context


inspectExpression : Config context -> Expression -> context -> context
inspectExpression config expression context =
    actionLambda
        config.onExpression
        (inspectInnerExpression config <| Tuple.second expression)
        expression
        context


inspectInnerExpression : Config context -> InnerExpression -> context -> context
inspectInnerExpression config expression context =
    case expression of
        UnitExpr ->
            context

        FunctionOrValue functionOrVal ->
            actionLambda config.onFunctionOrValue
                identity
                functionOrVal
                context

        PrefixOperator _ ->
            context

        Operator _ ->
            context

        Integer _ ->
            context

        Floatable _ ->
            context

        Literal _ ->
            context

        CharLiteral _ ->
            context

        QualifiedExpr _ _ ->
            context

        RecordAccess stringList ->
            actionLambda config.onRecordAccess
                identity
                stringList
                context

        RecordAccessFunction _ ->
            context

        GLSLExpression _ ->
            context

        Application expressionList ->
            List.foldl (inspectExpression config) context expressionList

        OperatorApplicationExpression operatorApplication ->
            actionLambda config.onOperatorApplication
                (flip (List.foldl (inspectExpression config)) [ operatorApplication.left, operatorApplication.right ])
                operatorApplication
                context

        IfBlock e1 e2 e3 ->
            List.foldl (inspectExpression config) context [ e1, e2, e3 ]

        TupledExpression expressionList ->
            List.foldl (inspectExpression config) context expressionList

        ParenthesizedExpression expression ->
            inspectExpression config expression context

        LetExpression letBlock ->
            let
                next =
                    inspectDeclarations config letBlock.declarations >> inspectExpression config letBlock.expression
            in
                actionLambda config.onLetBlock
                    next
                    letBlock
                    context

        CaseExpression caseBlock ->
            let
                context2 =
                    inspectExpression config caseBlock.expression context

                context3 =
                    List.foldl (\a b -> inspectCase config a b) context2 caseBlock.cases
            in
                context3

        LambdaExpression lambda ->
            actionLambda config.onLambda
                (inspectExpression config lambda.expression)
                lambda
                context

        ListExpr expressionList ->
            List.foldl (inspectExpression config) context expressionList

        RecordExpr expressionStringList ->
            List.foldl (\a b -> inspectExpression config (Tuple.second a) b) context expressionStringList

        RecordUpdateExpression recordUpdate ->
            actionLambda config.onRecordUpdate
                (\c -> List.foldl (\a b -> inspectExpression config (Tuple.second a) b) c recordUpdate.updates)
                recordUpdate
                context


inspectCase : Config context -> Case -> context -> context
inspectCase config caze context =
    actionLambda config.onCase
        (inspectExpression config (Tuple.second caze))
        caze
        context
