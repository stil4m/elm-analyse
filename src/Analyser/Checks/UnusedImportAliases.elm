module Analyser.Checks.UnusedImportAliases exposing (scan)

import AST.Ranges exposing (Range)
import AST.Types exposing (Expression, InnerExpression(QualifiedExpr), Import, ModuleName, FunctionSignature, TypeAlias, TypeReference(Typed))
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages exposing (Message(UnusedImportAlias))
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
            |> List.map (uncurry (UnusedImportAlias fileContext.path))


markUsage : ModuleName -> Context -> Context
markUsage key context =
    Dict.update key (Maybe.map (Tuple2.mapSecond ((+) 1))) context


onImport : Import -> Context -> Context
onImport imp context =
    case imp.moduleAlias of
        Just x ->
            Dict.insert x ( imp.range, 0 ) context

        Nothing ->
            context


onTypeReference : TypeReference -> Context -> Context
onTypeReference typeReference context =
    case typeReference of
        Typed moduleName name args ->
            markUsage moduleName context

        _ ->
            context


onExpression : Expression -> Context -> Context
onExpression expr context =
    case Tuple.second expr of
        QualifiedExpr moduleName name ->
            markUsage moduleName context

        _ ->
            context
