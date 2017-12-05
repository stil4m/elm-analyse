module Analyser.Checks.Variables exposing (ActiveScope, Scope, UsedVariableContext, collect)

import ASTUtil.Inspector as Inspector exposing (Order(Inner, Post, Pre), defaultConfig)
import ASTUtil.Variables exposing (VariableType(Pattern), getLetDeclarationsVars, getTopLevels, patternToUsedVars, patternToVars, patternToVarsInner, withoutTopLevel)
import Analyser.FileContext exposing (FileContext)
import Dict exposing (Dict)
import Elm.Syntax.Base exposing (..)
import Elm.Syntax.Expression exposing (..)
import Elm.Syntax.File exposing (..)
import Elm.Syntax.Infix exposing (..)
import Elm.Syntax.Pattern exposing (..)
import Elm.Syntax.Range as Syntax
import Elm.Syntax.Ranged exposing (Ranged)
import Elm.Syntax.TypeAnnotation exposing (TypeAnnotation(Typed))
import Tuple3


type alias Scope =
    Dict String ( Int, VariableType, Syntax.Range )


type alias ActiveScope =
    ( List String, Scope )


type alias UsedVariableContext =
    { poppedScopes : List Scope
    , activeScopes : List ActiveScope
    }


collect : FileContext -> UsedVariableContext
collect fileContext =
    Inspector.inspect
        { defaultConfig
            | onFile = Pre onFile
            , onFunction = Inner onFunction
            , onLetBlock = Inner onLetBlock
            , onLambda = Inner onLambda
            , onCase = Inner onCase
            , onOperatorApplication = Post onOperatorAppliction
            , onDestructuring = Post onDestructuring
            , onFunctionOrValue = Post onFunctionOrValue
            , onPrefixOperator = Post onPrefixOperator
            , onRecordUpdate = Post onRecordUpdate
            , onTypeAnnotation = Post onTypeAnnotation
        }
        fileContext.ast
        emptyContext


emptyContext : UsedVariableContext
emptyContext =
    { poppedScopes = [], activeScopes = [] }


addUsedVariable : String -> UsedVariableContext -> UsedVariableContext
addUsedVariable x context =
    { context | activeScopes = flagVariable x context.activeScopes }


popScope : UsedVariableContext -> UsedVariableContext
popScope x =
    { x
        | activeScopes = List.drop 1 x.activeScopes
        , poppedScopes =
            List.head x.activeScopes
                |> Maybe.map
                    (\( _, activeScope ) ->
                        if Dict.isEmpty activeScope then
                            x.poppedScopes
                        else
                            activeScope :: x.poppedScopes
                    )
                |> Maybe.withDefault x.poppedScopes
    }


pushScope : List ( VariablePointer, VariableType ) -> UsedVariableContext -> UsedVariableContext
pushScope vars x =
    let
        y : ActiveScope
        y =
            vars
                |> List.map (\( z, t ) -> ( z.value, ( 0, t, z.range ) ))
                |> Dict.fromList
                |> (,) []
    in
    { x | activeScopes = y :: x.activeScopes }


unMaskVariable : String -> UsedVariableContext -> UsedVariableContext
unMaskVariable k context =
    { context
        | activeScopes =
            case context.activeScopes of
                [] ->
                    []

                ( masked, vs ) :: xs ->
                    ( List.filter ((/=) k) masked, vs ) :: xs
    }


maskVariable : String -> UsedVariableContext -> UsedVariableContext
maskVariable k context =
    { context
        | activeScopes =
            case context.activeScopes of
                [] ->
                    []

                ( masked, vs ) :: xs ->
                    ( k :: masked, vs ) :: xs
    }


flagVariable : String -> List ActiveScope -> List ActiveScope
flagVariable k l =
    case l of
        [] ->
            []

        ( masked, x ) :: xs ->
            if List.member k masked then
                ( masked, x ) :: xs
            else if Dict.member k x then
                ( masked, Dict.update k (Maybe.map (Tuple3.mapFirst ((+) 1))) x ) :: xs
            else
                ( masked, x ) :: flagVariable k xs


onFunctionOrValue : String -> UsedVariableContext -> UsedVariableContext
onFunctionOrValue x context =
    addUsedVariable x context


onPrefixOperator : String -> UsedVariableContext -> UsedVariableContext
onPrefixOperator prefixOperator context =
    addUsedVariable prefixOperator context


onRecordUpdate : RecordUpdate -> UsedVariableContext -> UsedVariableContext
onRecordUpdate recordUpdate context =
    addUsedVariable recordUpdate.name context


onOperatorAppliction : ( String, InfixDirection, Ranged Expression, Ranged Expression ) -> UsedVariableContext -> UsedVariableContext
onOperatorAppliction ( op, _, _, _ ) context =
    addUsedVariable op context


onFile : File -> UsedVariableContext -> UsedVariableContext
onFile file context =
    getTopLevels file
        |> flip pushScope context


onFunction : (UsedVariableContext -> UsedVariableContext) -> Function -> UsedVariableContext -> UsedVariableContext
onFunction f function context =
    let
        used =
            List.concatMap patternToUsedVars function.declaration.arguments
                |> List.map .value

        postContext =
            context
                |> maskVariable function.declaration.name.value
                |> (\c ->
                        function.declaration.arguments
                            |> List.concatMap patternToVars
                            |> flip pushScope c
                            |> f
                            |> popScope
                            |> unMaskVariable function.declaration.name.value
                   )
    in
    List.foldl addUsedVariable postContext used


onLambda : (UsedVariableContext -> UsedVariableContext) -> Lambda -> UsedVariableContext -> UsedVariableContext
onLambda f lambda context =
    let
        preContext =
            lambda.args
                |> List.concatMap patternToVars
                |> flip pushScope context

        postContext =
            f preContext
    in
    postContext |> popScope


onLetBlock : (UsedVariableContext -> UsedVariableContext) -> LetBlock -> UsedVariableContext -> UsedVariableContext
onLetBlock f letBlock context =
    letBlock.declarations
        |> (getLetDeclarationsVars >> withoutTopLevel)
        |> flip pushScope context
        |> f
        |> popScope


onDestructuring : ( Ranged Pattern, Ranged Expression ) -> UsedVariableContext -> UsedVariableContext
onDestructuring ( pattern, _ ) context =
    List.foldl addUsedVariable
        context
        (List.map .value (patternToUsedVars pattern))


onCase : (UsedVariableContext -> UsedVariableContext) -> Case -> UsedVariableContext -> UsedVariableContext
onCase f caze context =
    let
        used =
            patternToUsedVars (Tuple.first caze) |> List.map .value

        postContext =
            Tuple.first caze
                |> patternToVarsInner False
                |> flip pushScope context
                |> f
                |> popScope
    in
    List.foldl addUsedVariable postContext used


onTypeAnnotation : Ranged TypeAnnotation -> UsedVariableContext -> UsedVariableContext
onTypeAnnotation ( r, t ) c =
    case t of
        Typed [] name _ ->
            addUsedVariable name c

        _ ->
            c
