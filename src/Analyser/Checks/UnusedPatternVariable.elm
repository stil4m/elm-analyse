module Analyser.Checks.UnusedPatternVariable exposing (checker)

import AST.Ranges as Range
import ASTUtil.Inspector as Inspector exposing (Order(..), defaultConfig)
import ASTUtil.Variables exposing (VariableType(..), getLetDeclarationsVars, getTopLevels, patternToUsedVars, patternToVars, patternToVarsInner, withoutTopLevel)
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Schema as Schema
import Dict exposing (Dict)
import Elm.Interface as Interface
import Elm.Syntax.Base exposing (VariablePointer)
import Elm.Syntax.Expression exposing (Case, Expression(..), Function, Lambda, LetBlock, RecordUpdate)
import Elm.Syntax.File exposing (File)
import Elm.Syntax.Infix exposing (InfixDirection)
import Elm.Syntax.Module exposing (Module(..))
import Elm.Syntax.Pattern exposing (Pattern(..))
import Elm.Syntax.Range as Syntax exposing (Range)
import Elm.Syntax.Ranged exposing (Ranged)
import Elm.Syntax.TypeAnnotation exposing (TypeAnnotation(..))
import Tuple.Extra


checker : Checker
checker =
    { check = scan
    , info =
        { key = "UnusedPatternVariable"
        , name = "Unused Pattern Variable"
        , description = "Variables in pattern matching that are unused should be replaced with '_' to avoid unnecessary noise."
        , schema =
            Schema.schema
                |> Schema.varProp "varName"
                |> Schema.rangeProp "range"
        }
    }


type alias Scope =
    Dict String ( Int, VariableType, Syntax.Range )


type alias ActiveScope =
    ( List String, Scope )


type alias UsedVariableContext =
    { poppedScopes : List Scope
    , activeScopes : List ActiveScope
    }


scan : FileContext -> Configuration -> List MessageData
scan fileContext _ =
    let
        x : UsedVariableContext
        x =
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

        onlyUnused : List ( String, ( Int, VariableType, Syntax.Range ) ) -> List ( String, ( Int, VariableType, Syntax.Range ) )
        onlyUnused =
            List.filter (Tuple.second >> Tuple.Extra.first3 >> (==) 0)

        unusedVariables =
            x.poppedScopes
                |> List.concatMap Dict.toList
                |> onlyUnused
                |> List.filterMap (\( x, ( _, t, y ) ) -> forVariableType t x y)

        unusedTopLevels =
            x.activeScopes
                |> List.head
                |> Maybe.map Tuple.second
                |> Maybe.withDefault Dict.empty
                |> Dict.toList
                |> onlyUnused
                |> List.filter (filterByModuleType fileContext)
                |> List.filter (Tuple.first >> (\a -> Interface.exposesFunction a fileContext.interface) >> not)
                |> List.filterMap (\( x, ( _, t, y ) ) -> forVariableType t x y)
    in
    unusedVariables ++ unusedTopLevels


forVariableType : VariableType -> String -> Range -> Maybe MessageData
forVariableType variableType variableName range =
    case variableType of
        Pattern ->
            Just
                (Data.init
                    (String.concat
                        [ "Unused variable `"
                        , variableName
                        , "` inside pattern at "
                        , Range.rangeToString range
                        ]
                    )
                    |> Data.addVarName "varName" variableName
                    |> Data.addRange "range" range
                )

        _ ->
            Nothing


filterByModuleType : FileContext -> ( String, ( Int, VariableType, Syntax.Range ) ) -> Bool
filterByModuleType fileContext =
    case fileContext.ast.moduleDefinition of
        EffectModule _ ->
            filterForEffectModule

        _ ->
            always True


filterForEffectModule : ( String, ( Int, VariableType, Syntax.Range ) ) -> Bool
filterForEffectModule ( k, _ ) =
    not <| List.member k [ "init", "onEffects", "onSelfMsg", "subMap", "cmdMap" ]


pushScope : List ( VariablePointer, VariableType ) -> UsedVariableContext -> UsedVariableContext
pushScope vars x =
    let
        y : ActiveScope
        y =
            vars
                |> List.map (\( z, t ) -> ( z.value, ( 0, t, z.range ) ))
                |> Dict.fromList
                |> (\b -> ( [], b ))
    in
    { x | activeScopes = y :: x.activeScopes }


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


emptyContext : UsedVariableContext
emptyContext =
    { poppedScopes = [], activeScopes = [] }


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
                ( masked, Dict.update k (Maybe.map (Tuple.Extra.mapFirst3 ((+) 1))) x ) :: xs

            else
                ( masked, x ) :: flagVariable k xs


addUsedVariable : String -> UsedVariableContext -> UsedVariableContext
addUsedVariable x context =
    { context | activeScopes = flagVariable x context.activeScopes }


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
        |> (\a -> pushScope a context)


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
                            |> (\a -> pushScope a c)
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
                |> (\a -> pushScope a context)

        postContext =
            f preContext
    in
    postContext |> popScope


onLetBlock : (UsedVariableContext -> UsedVariableContext) -> LetBlock -> UsedVariableContext -> UsedVariableContext
onLetBlock f letBlock context =
    letBlock.declarations
        |> (getLetDeclarationsVars >> withoutTopLevel)
        |> (\a -> pushScope a context)
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
                |> (\a -> pushScope a context)
                |> f
                |> popScope
    in
    List.foldl addUsedVariable postContext used


onTypeAnnotation : Ranged TypeAnnotation -> UsedVariableContext -> UsedVariableContext
onTypeAnnotation ( _, t ) c =
    case t of
        Typed [] name _ ->
            addUsedVariable name c

        _ ->
            c
