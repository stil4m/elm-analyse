module Analyser.Checks.UnusedImport exposing (checker)

import AST.Ranges as Range
import ASTUtil.Inspector as Inspector exposing (Order(..), defaultConfig)
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Schema as Schema
import Dict exposing (Dict)
import Elm.Syntax.Expression exposing (Case, Expression(..), Function, LetDeclaration(..))
import Elm.Syntax.Import exposing (Import)
import Elm.Syntax.ModuleName exposing (ModuleName)
import Elm.Syntax.Node as Node exposing (Node(..))
import Elm.Syntax.Pattern exposing (Pattern)
import Elm.Syntax.Range as Range exposing (Range)
import Elm.Syntax.TypeAnnotation exposing (TypeAnnotation(..))


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
            , onFunction = Post onFunction
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
            , Range.rangeToString range
            ]
        )
        |> Data.addRange "range" range
        |> Data.addModuleName "moduleName" moduleName


markUsage : ModuleName -> Context -> Context
markUsage key context =
    Dict.update key (Maybe.map (Tuple.mapSecond ((+) 1))) context


markPatternUsage : Node Pattern -> Context -> Context
markPatternUsage (Node _ pattern) context =
    List.foldl markUsage context (Elm.Syntax.Pattern.moduleNames pattern)


onImport : Node Import -> Context -> Context
onImport (Node range imp) context =
    if imp.moduleAlias == Nothing && imp.exposingList == Nothing then
        Dict.insert (Node.value imp.moduleName) ( range, 0 ) context

    else
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

        LetExpression { declarations } ->
            List.foldl
                (\(Node _ declaration) ->
                    case declaration of
                        -- Functions are handled elsewhere.
                        LetFunction _ ->
                            identity

                        LetDestructuring pattern _ ->
                            markPatternUsage pattern
                )
                context
                declarations

        LambdaExpression lambda ->
            List.foldl markPatternUsage context lambda.args

        _ ->
            context


onCase : Case -> Context -> Context
onCase ( pattern, _ ) context =
    markPatternUsage pattern context


onFunction : Node Function -> Context -> Context
onFunction (Node _ { declaration }) context =
    let
        (Node _ { arguments }) =
            declaration
    in
    List.foldl markPatternUsage context arguments
