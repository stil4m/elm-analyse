module Analyser.Checks.UnusedImportAlias exposing (checker)

import AST.Ranges as Range
import ASTUtil.Inspector as Inspector exposing (Order(..), defaultConfig)
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Schema as Schema
import Dict exposing (Dict)
import Elm.Syntax.Expression exposing (Case, Expression(..))
import Elm.Syntax.Import exposing (Import)
import Elm.Syntax.ModuleName exposing (ModuleName)
import Elm.Syntax.Node as Node exposing (Node(..))
import Elm.Syntax.Pattern
import Elm.Syntax.Range as Range exposing (Range)
import Elm.Syntax.TypeAnnotation exposing (TypeAnnotation(..))


checker : Checker
checker =
    { check = scan
    , info =
        { key = "UnusedImportAlias"
        , name = "Unused Import Alias"
        , description = "You defined an alias for an import (import Foo as F), but it turns out you never use it."
        , schema =
            Schema.schema
                |> Schema.moduleProp "moduleName"
                |> Schema.rangeProp "range"
        }
    }


type alias Context =
    Dict ModuleName ( Range, Int )


scan : FileContext -> Configuration -> List MessageData
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
        |> List.map buildMessageData


buildMessageData : ( ModuleName, Range ) -> MessageData
buildMessageData ( moduleName, range ) =
    Data.init
        (String.concat
            [ "Unused import alias `"
            , String.join "." moduleName
            , "` at "
            , Range.rangeToString range
            ]
        )
        |> Data.addModuleName "moduleName" moduleName
        |> Data.addRange "range" range


markUsage : ModuleName -> Context -> Context
markUsage key context =
    Dict.update key (Maybe.map (Tuple.mapSecond ((+) 1))) context


onImport : Node Import -> Context -> Context
onImport (Node r imp) context =
    case Maybe.map Node.value imp.moduleAlias of
        Just x ->
            Dict.insert x ( r, 0 ) context

        Nothing ->
            context


onTypeAnnotation : Node TypeAnnotation -> Context -> Context
onTypeAnnotation (Node _ typeAnnotation) context =
    case typeAnnotation of
        Typed (Node _ ( moduleName, _ )) _ ->
            markUsage moduleName context

        _ ->
            context


onExpression : Node Expression -> Context -> Context
onExpression expr context =
    case Node.value expr of
        FunctionOrValue moduleName _ ->
            markUsage moduleName context

        _ ->
            context


onCase : Case -> Context -> Context
onCase ( Node _ pattern, _ ) context =
    List.foldl markUsage context (Elm.Syntax.Pattern.moduleNames pattern)
