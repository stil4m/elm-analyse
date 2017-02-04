module Analyser.Checks.UnusedImports exposing (scan)

import AST.Ranges exposing (Range)
import AST.Types exposing (Exposure(None), Expression, InnerExpression(QualifiedExpr), Import, ModuleName, FunctionSignature, TypeAlias, TypeReference(Typed))
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages exposing (Message(UnusedImport))
import Dict exposing (Dict)
import Inspector exposing (Action(Post), defaultConfig)
import Tuple2


type alias Context =
    Dict ModuleName ( Range, Int )


scan : FileContext -> List Message
scan fileContext =
    let
        aliases : Context
        aliases =
            Inspector.inspect
                { defaultConfig | onImport = Post onImport }
                fileContext.ast
                Dict.empty
    in
        Inspector.inspect
            { defaultConfig
                | onTypeReference = Post onTypeReference
                , onExpression = Post onExpression
            }
            fileContext.ast
            aliases
            |> Dict.toList
            |> List.filter (Tuple.second >> Tuple.second >> (==) 0)
            |> List.map (Tuple2.mapSecond Tuple.first)
            |> List.map (uncurry (UnusedImport fileContext.path))


markUsage : ModuleName -> Context -> Context
markUsage key context =
    Dict.update key (Maybe.map (Tuple2.mapSecond ((+) 1))) context


onImport : Import -> Context -> Context
onImport imp context =
    if imp.moduleAlias == Nothing && imp.exposingList == None then
        Dict.insert imp.moduleName ( imp.range, 0 ) context
    else
        context


onTypeReference : TypeReference -> Context -> Context
onTypeReference typeReference context =
    case typeReference of
        Typed moduleName _ _ ->
            markUsage moduleName context

        _ ->
            context


onExpression : Expression -> Context -> Context
onExpression expr context =
    case Tuple.second expr of
        QualifiedExpr moduleName _ ->
            markUsage moduleName context

        _ ->
            context
