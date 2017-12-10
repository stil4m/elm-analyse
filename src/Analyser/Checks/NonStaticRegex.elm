module Analyser.Checks.NonStaticRegex exposing (checker)

import AST.Ranges as Range
import ASTUtil.Functions
import ASTUtil.Imports as Imports exposing (FunctionReference)
import ASTUtil.Inspector as Inspector exposing (Order(Inner, Post), defaultConfig)
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Schema as Schema
import Elm.Syntax.Base exposing (ModuleName)
import Elm.Syntax.Expression exposing (Expression(..), Function)
import Elm.Syntax.Range as Range exposing (Range)
import Elm.Syntax.Ranged exposing (Ranged)


type alias Context =
    { staticEnvironment : Bool
    , usages : List Range
    }


checker : Checker
checker =
    { check = scan
    , info =
        { key = "NonStaticRegex"
        , name = "Non Static Regex"
        , description = "Define regexes as top level to avoid run time exceptions."
        , schema =
            Schema.schema
                |> Schema.rangeProp "range"
        }
    }


{-| Find out if `Regex.regex` and in what manner.
If it is imported the dynamic usages should inspected and then transformed into messages.
-}
scan : FileContext -> Configuration -> List MessageData
scan fileContext _ =
    let
        regexImport =
            Imports.buildImportInformation [ "Regex" ] "regex" fileContext.ast
    in
    case regexImport of
        Nothing ->
            []

        Just regexImport ->
            findRegexUsagesInFunctions regexImport fileContext
                |> .usages
                |> List.map
                    (\r ->
                        Data.init
                            (String.concat
                                [ "Use of `Regex.regex` as non-static at "
                                , Range.rangeToString r
                                ]
                            )
                            |> Data.addRange "range" r
                    )


{-| Inspect all functions to verify if the enviroments changes from static to dynamic, and check all expressions for regex usages.
-}
findRegexUsagesInFunctions : FunctionReference -> FileContext -> Context
findRegexUsagesInFunctions regexImport fileContext =
    Inspector.inspect
        { defaultConfig
            | onFunction = Inner onFunction
            , onExpression = Post (onExpression regexImport)
        }
        fileContext.ast
        startingContext


startingContext : Context
startingContext =
    { staticEnvironment = True, usages = [] }


{-| Set the `staticEnvironment` to False when an function is encountered.
When the function returns from inner, reset the property in the context.
-}
onFunction : (Context -> Context) -> Function -> Context -> Context
onFunction inner function context =
    if not (ASTUtil.Functions.isStatic function) then
        let
            after =
                inner { context | staticEnvironment = False }
        in
        { after | staticEnvironment = context.staticEnvironment }
    else
        inner context


onExpression : FunctionReference -> Ranged Expression -> Context -> Context
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


{-| Check if regex in a qualified expression (with either the module name or the alias for the module)
-}
onExpressionQualified : ModuleName -> Ranged Expression -> Context -> Context
onExpressionQualified moduleName ( range, inner ) context =
    case inner of
        QualifiedExpr m f ->
            if f == "regex" && m == moduleName then
                addUsedRegex range context
            else
                context

        _ ->
            context


onExpressionFunctionReference : Ranged Expression -> Context -> Context
onExpressionFunctionReference ( range, inner ) context =
    case inner of
        FunctionOrValue "regex" ->
            addUsedRegex range context

        _ ->
            context
