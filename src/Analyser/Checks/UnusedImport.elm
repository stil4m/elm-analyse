module Analyser.Checks.UnusedImport exposing (checker)

import Elm.Syntax.Range exposing (Range)
import Elm.Syntax.Module exposing (..)
import Elm.Syntax.Base exposing (..)
import Elm.Syntax.TypeAnnotation exposing (..)
import Elm.Syntax.Expression exposing (..)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Types exposing (Message, MessageData(UnusedImport), newMessage)
import Dict exposing (Dict)
import ASTUtil.Inspector as Inspector exposing (Order(Post), defaultConfig)
import AST.Util as Util
import Analyser.Configuration exposing (Configuration)
import Analyser.Checks.Base exposing (Checker, keyBasedChecker)
import Elm.Syntax.Exposing exposing (..)


checker : Checker
checker =
    { check = scan
    , shouldCheck = keyBasedChecker [ "UnusedImport" ]
    }


type alias Context =
    Dict ModuleName ( Range, Int )


scan : FileContext -> Configuration -> List Message
scan fileContext _ =
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
                | onTypeAnnotation = Post onTypeAnnotation
                , onExpression = Post onExpression
                , onCase = Post onCase
            }
            fileContext.ast
            aliases
            |> Dict.toList
            |> List.filter (Tuple.second >> Tuple.second >> (==) 0)
            |> List.map (Tuple.mapSecond Tuple.first)
            |> List.map (uncurry (UnusedImport fileContext.path))
            |> List.map (newMessage [ ( fileContext.sha1, fileContext.path ) ])


markUsage : ModuleName -> Context -> Context
markUsage key context =
    Dict.update key (Maybe.map (Tuple.mapSecond ((+) 1))) context


onImport : Import -> Context -> Context
onImport imp context =
    if imp.moduleAlias == Nothing && imp.exposingList == None then
        Dict.insert imp.moduleName ( imp.range, 0 ) context
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
