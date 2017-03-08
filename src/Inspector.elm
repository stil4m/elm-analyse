module Inspector exposing (Order(Skip, Continue, Pre, Post, Inner), Config, defaultConfig, inspect)

import AST.Types exposing (File, Import, ValueConstructor, InfixDirection, Type, TypeAlias, TypeReference(..), FunctionSignature, Declaration(TypeDecl, FuncDecl, AliasDecl, PortDeclaration, InfixDeclaration, DestructuringDeclaration), Function, Destructuring, Expression, InnerExpression(..), Lambda, LetBlock, Case, RecordUpdate)


type Order context x
    = Skip
    | Continue
    | Pre (x -> context -> context)
    | Post (x -> context -> context)
    | Inner ((context -> context) -> x -> context -> context)


type alias Config context =
    { onFile : Order context File
    , onImport : Order context Import
    , onFunction : Order context Function
    , onFunctionSignature : Order context FunctionSignature
    , onPortDeclaration : Order context FunctionSignature
    , onTypeAlias : Order context TypeAlias
    , onDestructuring : Order context Destructuring
    , onExpression : Order context Expression
    , onOperatorApplication : Order context ( String, InfixDirection, Expression, Expression )
    , onTypeReference : Order context TypeReference
    , onLambda : Order context Lambda
    , onLetBlock : Order context LetBlock
    , onCase : Order context Case
    , onFunctionOrValue : Order context String
    , onRecordAccess : Order context ( Expression, String )
    , onRecordUpdate : Order context RecordUpdate
    }


defaultConfig : Config x
defaultConfig =
    { onFile = Continue
    , onImport = Continue
    , onFunction = Continue
    , onPortDeclaration = Continue
    , onFunctionSignature = Continue
    , onTypeReference = Continue
    , onTypeAlias = Continue
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


actionLambda : Order config x -> (config -> config) -> x -> config -> config
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
        (inspectImports config file.imports >> inspectDeclarations config file.declarations)
        file
        context


inspectImports : Config context -> List Import -> context -> context
inspectImports config imports context =
    List.foldl (inspectImport config) context imports


inspectImport : Config context -> Import -> context -> context
inspectImport config imp context =
    actionLambda config.onImport
        identity
        imp
        context


inspectDeclarations : Config context -> List Declaration -> context -> context
inspectDeclarations config declarations context =
    List.foldl (inspectDeclaration config) context declarations


inspectDeclaration : Config context -> Declaration -> context -> context
inspectDeclaration config declaration context =
    case declaration of
        FuncDecl function ->
            inspectFunction config function context

        AliasDecl typeAlias ->
            inspectTypeAlias config typeAlias context

        TypeDecl typeDecl ->
            inspectType config typeDecl context

        PortDeclaration signature ->
            inspectPortDeclaration config signature context

        InfixDeclaration _ ->
            context

        DestructuringDeclaration destructing ->
            inspectDestructuring config destructing context


inspectType : Config context -> Type -> context -> context
inspectType config typeDecl context =
    List.foldl (inspectValueConstructor config) context typeDecl.constructors


inspectValueConstructor : Config context -> ValueConstructor -> context -> context
inspectValueConstructor config valueConstructor context =
    List.foldl (inspectTypeReference config) context valueConstructor.arguments


inspectTypeAlias : Config context -> TypeAlias -> context -> context
inspectTypeAlias config typeAlias context =
    actionLambda
        config.onTypeAlias
        (inspectTypeReference config typeAlias.typeReference)
        typeAlias
        context


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
        (inspectExpression config function.declaration.expression
            >> (Maybe.withDefault identity <|
                    Maybe.map (inspectSignature config) function.signature
               )
        )
        function
        context


inspectPortDeclaration : Config context -> FunctionSignature -> context -> context
inspectPortDeclaration config signature context =
    actionLambda
        config.onPortDeclaration
        (inspectSignature config signature)
        signature
        context


inspectSignature : Config context -> FunctionSignature -> context -> context
inspectSignature config signature context =
    actionLambda
        config.onFunctionSignature
        (inspectTypeReference config signature.typeReference)
        signature
        context


inspectTypeReference : Config context -> TypeReference -> context -> context
inspectTypeReference config typeReference context =
    actionLambda
        config.onTypeReference
        (inspectTypeReferenceInner config typeReference)
        typeReference
        context


inspectTypeReferenceInner : Config context -> TypeReference -> context -> context
inspectTypeReferenceInner config typeRefence context =
    case typeRefence of
        Typed _ _ typeArgs _ ->
            List.foldl (inspectTypeReference config) context typeArgs

        Tupled typeReferences _ ->
            List.foldl (inspectTypeReference config) context typeReferences

        Record recordDefinition _ ->
            List.foldl (inspectTypeReference config) context (List.map Tuple.second recordDefinition)

        GenericRecord _ recordDefinition _ ->
            List.foldl (inspectTypeReference config) context (List.map Tuple.second recordDefinition)

        FunctionTypeReference left right _ ->
            List.foldl (inspectTypeReference config) context [ left, right ]

        Unit _ ->
            context

        GenericType _ _ ->
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

        RecordAccess ex1 key ->
            actionLambda config.onRecordAccess
                (inspectExpression config ex1)
                ( ex1, key )
                context

        RecordAccessFunction _ ->
            context

        GLSLExpression _ ->
            context

        Application expressionList ->
            List.foldl (inspectExpression config) context expressionList

        OperatorApplication op dir left right ->
            actionLambda config.onOperatorApplication
                (flip (List.foldl (inspectExpression config)) [ left, right ])
                ( op, dir, left, right )
                context

        IfBlock e1 e2 e3 ->
            List.foldl (inspectExpression config) context [ e1, e2, e3 ]

        TupledExpression expressionList ->
            List.foldl (inspectExpression config) context expressionList

        ParenthesizedExpression inner ->
            inspectExpression config inner context

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
