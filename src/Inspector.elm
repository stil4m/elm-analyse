module Inspector exposing (..)

import AST.Types exposing (..)


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
    , onExpression : Action context Expression
    , onLambda : Action context Lambda
    , onLetBlock : Action context LetBlock
    }


defaultConfig : Config x
defaultConfig =
    { onFile = Continue
    , onDeclaration = Continue
    , onFunction = Continue
    , onExpression = Continue
    , onLambda = Continue
    , onLetBlock = Continue
    }


actionLambda : Action config x -> (config -> config) -> x -> config -> config
actionLambda act =
    case act of
        Skip ->
            (\f x c -> c)

        Continue ->
            (\f x c -> f c)

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
            context

        TypeDecl _ ->
            context

        PortDeclaration _ ->
            context

        InfixDeclaration _ ->
            context

        Destructuring _ _ ->
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
        (inspectExpressionInner config expression)
        expression
        context


inspectExpressionInner : Config context -> Expression -> context -> context
inspectExpressionInner config expression context =
    context
