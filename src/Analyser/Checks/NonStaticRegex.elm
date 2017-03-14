module Analyser.Checks.NonStaticRegex exposing (checker)

import AST.Types exposing (File, FunctionSignature, TypeReference(FunctionTypeReference), InnerExpression(QualifiedExpr, FunctionOrValue), Import, Case, LetBlock, VariablePointer, Destructuring, Pattern, Function, Lambda, Exposure, ModuleName, Expression, InnerExpression)
import AST.Ranges exposing (Range)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Types exposing (Message, MessageData(NonStaticRegex), newMessage)
import Inspector exposing (Order(Post, Inner), defaultConfig)
import Analyser.Configuration exposing (Configuration)
import Analyser.Checks.Base exposing (Checker, keyBasedChecker)
import ASTUtil.Expose as Expose


type alias Context =
    { staticEnvironment : Bool
    , usages : List Range
    }


type alias FunctionReference =
    { moduleName : ModuleName
    , exposesRegex : Bool
    }


checker : Checker
checker =
    { check = scan
    , shouldCheck = keyBasedChecker [ "NonStaticRegex" ]
    }


scan : FileContext -> Configuration -> List Message
scan fileContext _ =
    let
        regexImport =
            buildRegexImportInformation fileContext.ast.imports
    in
        case regexImport of
            Nothing ->
                []

            Just regexImport ->
                Inspector.inspect
                    { defaultConfig
                        | onExpression = Post (onExpression regexImport)
                        , onFunction = Inner onFunction
                    }
                    fileContext.ast
                    { staticEnvironment = True, usages = [] }
                    |> .usages
                    |> List.map (NonStaticRegex fileContext.path)
                    |> List.map (newMessage [ ( fileContext.sha1, fileContext.path ) ])


onFunction : (Context -> Context) -> Function -> Context -> Context
onFunction f function context =
    if not (isStatic function) then
        let
            after =
                f { context | staticEnvironment = False }
        in
            { after | staticEnvironment = context.staticEnvironment }
    else
        f context


isStatic : Function -> Bool
isStatic function =
    if List.length function.declaration.arguments > 0 then
        False
    else if function.declaration.operatorDefinition then
        False
    else if Maybe.withDefault False <| Maybe.map isFunctionSignature function.signature then
        False
    else
        True


isFunctionSignature : FunctionSignature -> Bool
isFunctionSignature { typeReference } =
    isFunctionTypeReference typeReference


isFunctionTypeReference : TypeReference -> Bool
isFunctionTypeReference typeReference =
    case typeReference of
        FunctionTypeReference _ _ _ ->
            True

        _ ->
            False


onExpression : FunctionReference -> Expression -> Context -> Context
onExpression x expression context =
    if x.exposesRegex then
        onExpressionFunctionReference expression context
            |> onExpressionQualified x.moduleName expression
    else
        onExpressionQualified x.moduleName expression context


addUsedRegex : Range -> Context -> Context
addUsedRegex range context =
    if context.staticEnvironment then
        context
    else
        { context | usages = range :: context.usages }


onExpressionQualified : ModuleName -> Expression -> Context -> Context
onExpressionQualified moduleName ( range, inner ) context =
    case inner of
        QualifiedExpr m f ->
            if f == "regex" && m == moduleName then
                addUsedRegex range context
            else
                context

        _ ->
            context


onExpressionFunctionReference : Expression -> Context -> Context
onExpressionFunctionReference ( range, inner ) context =
    case inner of
        FunctionOrValue "regex" ->
            addUsedRegex range context

        _ ->
            context


buildRegexImportInformation : List Import -> Maybe FunctionReference
buildRegexImportInformation imports =
    imports
        |> List.filter (\i -> i.moduleName == [ "Regex" ])
        |> List.head
        |> Maybe.map
            (\i ->
                { moduleName = Maybe.withDefault i.moduleName i.moduleAlias
                , exposesRegex = Expose.exposesFunction "regex" i.exposingList
                }
            )
