module Analyser.Checks.UnusedImport exposing (checker)

import AST.Util as Util
import ASTUtil.Inspector as Inspector exposing (Order(Post), defaultConfig)
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Range as Range exposing (Range, RangeContext)
import Analyser.Messages.Schema as Schema
import Dict exposing (Dict)
import Elm.Syntax.Base exposing (..)
import Elm.Syntax.Expression exposing (..)
import Elm.Syntax.Module exposing (..)
import Elm.Syntax.TypeAnnotation exposing (..)


checker : Checker
checker =
    { check = scan
    , info =
        { key = "UnusedImport"
        , name = "Unused Import"
        , description = "Imports that have no meaning should be removed."
        , schema =
            Schema.schema
                |> Schema.moduleProp "moduleName"
                |> Schema.rangeProp "range"
        }
    }


type alias Context =
    Dict ModuleName ( Range, Int )


scan : RangeContext -> FileContext -> Configuration -> List MessageData
scan rangeContext fileContext _ =
    let
        aliases : Context
        aliases =
            Inspector.inspect
                { defaultConfig | onImport = Post (onImport rangeContext) }
                fileContext.ast
                Dict.empty
    in
    Inspector.inspect
        { defaultConfig
            | onTypeAnnotation = Post onTypeAnnotation
            , onExpression = Post onExpression
            , onCase = Post onCase
        }
        fileContext.ast
        aliases
        |> Dict.toList
        |> List.filter (Tuple.second >> Tuple.second >> (==) 0)
        |> List.map (Tuple.mapSecond Tuple.first)
        |> List.map buildMessage


buildMessage : ( ModuleName, Range.Range ) -> MessageData
buildMessage ( moduleName, range ) =
    Data.init
        (String.concat
            [ "Unused import `"
            , String.join "." moduleName
            , "` at "
            , Range.asString range
            ]
        )
        |> Data.addRange "range" range
        |> Data.addModuleName "moduleName" moduleName


markUsage : ModuleName -> Context -> Context
markUsage key context =
    Dict.update key (Maybe.map (Tuple.mapSecond ((+) 1))) context


onImport : RangeContext -> Import -> Context -> Context
onImport rangeContext imp context =
    if imp.moduleAlias == Nothing && imp.exposingList == Nothing then
        Dict.insert imp.moduleName ( Range.build rangeContext imp.range, 0 ) context
    else
        context


onTypeAnnotation : TypeAnnotation -> Context -> Context
onTypeAnnotation typeAnnotation context =
    case typeAnnotation of
        Typed moduleName _ _ _ ->
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


onCase : Case -> Context -> Context
onCase ( pattern, _ ) context =
    List.foldl markUsage context (Util.patternModuleNames pattern)
