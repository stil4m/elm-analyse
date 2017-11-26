module Analyser.Checks.NonStaticRegex exposing (checker)

import ASTUtil.Functions
import ASTUtil.Imports as Imports exposing (FunctionReference)
import ASTUtil.Inspector as Inspector exposing (Order(Inner, Post), defaultConfig)
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Range as Range exposing (Range, RangeContext)
import Analyser.Messages.Schema as Schema
import Elm.Syntax.Base exposing (..)
import Elm.Syntax.Expression exposing (..)


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
scan : RangeContext -> FileContext -> Configuration -> List MessageData
scan rangeContext fileContext _ =
    let
        regexImport =
            Imports.buildImportInformation [ "Regex" ] "regex" fileContext.ast
    in
    case regexImport of
        Nothing ->
            []

        Just regexImport ->
            findRegexUsagesInFunctions rangeContext regexImport fileContext
                |> .usages
                |> List.map
                    (\r ->
                        Data.init
                            (String.concat
                                [ "Use of `Regex.regex` as non-static at "
                                , Range.asString r
                                ]
                            )
                            |> Data.addRange "range" r
                    )


{-| Inspect all functions to verify if the enviroments changes from static to dynamic, and check all expressions for regex usages.
-}
findRegexUsagesInFunctions : RangeContext -> FunctionReference -> FileContext -> Context
findRegexUsagesInFunctions rangeContext regexImport fileContext =
    Inspector.inspect
        { defaultConfig
            | onFunction = Inner onFunction
            , onExpression = Post (onExpression rangeContext regexImport)
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


onExpression : RangeContext -> FunctionReference -> Expression -> Context -> Context
onExpression rangeContext x expression context =
    if x.exposesRegex then
        onExpressionFunctionReference rangeContext expression context
            |> onExpressionQualified rangeContext x.moduleName expression
    else
        onExpressionQualified rangeContext x.moduleName expression context


addUsedRegex : Range -> Context -> Context
addUsedRegex range context =
    if context.staticEnvironment then
        context
    else
        { context | usages = range :: context.usages }


{-| Check if regex in a qualified expression (with either the module name or the alias for the module)
-}
onExpressionQualified : RangeContext -> ModuleName -> Expression -> Context -> Context
onExpressionQualified rangeContext moduleName ( range, inner ) context =
    case inner of
        QualifiedExpr m f ->
            if f == "regex" && m == moduleName then
                addUsedRegex (Range.build rangeContext range) context
            else
                context

        _ ->
            context


onExpressionFunctionReference : RangeContext -> Expression -> Context -> Context
onExpressionFunctionReference rangeContext ( range, inner ) context =
    case inner of
        FunctionOrValue "regex" ->
            addUsedRegex (Range.build rangeContext range) context

        _ ->
            context
