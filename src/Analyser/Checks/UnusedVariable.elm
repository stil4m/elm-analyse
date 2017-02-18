module Analyser.Checks.UnusedVariable exposing (scan)

import AST.Types
    exposing
        ( File
        , Lambda
        , RecordUpdate
        , LetBlock
        , Function
        , VariablePointer
        , Case
        , InfixDirection
        , Expression
        , Module(EffectModule)
        )
import AST.Ranges exposing (Range)
import Analyser.FileContext exposing (FileContext)
import Analyser.Files.Interface as Interface
import Analyser.Messages.Types exposing (Message, MessageData(UnusedVariable, UnusedTopLevel, UnusedImportedVariable, UnusedPatternVariable), newMessage)
import Dict exposing (Dict)
import Inspector exposing (defaultConfig, Order(Inner, Pre, Post))
import ASTUtil.Variables exposing (VariableType(Imported, Defined, Pattern, TopLevel), getTopLevels, patternToVars, patternToVarsInner, getDeclarationsVars, patternToUsedVars, withoutTopLevel)
import Tuple3


type alias Scope =
    Dict String ( Int, VariableType, Range )


type alias ActiveScope =
    ( List String, Scope )


type alias UsedVariableContext =
    { poppedScopes : List Scope
    , activeScopes : List ActiveScope
    }


scan : FileContext -> List Message
scan fileContext =
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
                    , onFunctionOrValue = Post onFunctionOrValue
                    , onRecordUpdate = Post onRecordUpdate
                }
                fileContext.ast
                emptyContext

        onlyUnused : List ( String, ( Int, VariableType, Range ) ) -> List ( String, ( Int, VariableType, Range ) )
        onlyUnused =
            List.filter (Tuple.second >> Tuple3.first >> (==) 0)

        unusedVariables =
            x.poppedScopes
                |> List.concatMap Dict.toList
                |> onlyUnused
                |> List.map (\( x, ( _, t, y ) ) -> forVariableType fileContext t x y)
                |> List.map (newMessage [ ( fileContext.sha1, fileContext.path ) ])

        unusedTopLevels =
            x.activeScopes
                |> List.head
                |> Maybe.map Tuple.second
                |> Maybe.withDefault Dict.empty
                |> Dict.toList
                |> onlyUnused
                |> List.filter (filterByModuleType fileContext)
                |> List.filter (Tuple.first >> flip Interface.doesExposeFunction fileContext.interface >> not)
                |> List.map (\( x, ( _, t, y ) ) -> forVariableType fileContext t x y)
                |> List.map (newMessage [ ( fileContext.sha1, fileContext.path ) ])
    in
        unusedVariables ++ unusedTopLevels


forVariableType : FileContext -> VariableType -> String -> Range -> MessageData
forVariableType fileContext variableType =
    case variableType of
        Imported ->
            UnusedImportedVariable fileContext.path

        TopLevel ->
            UnusedTopLevel fileContext.path

        Defined ->
            UnusedVariable fileContext.path

        Pattern ->
            UnusedPatternVariable fileContext.path


filterByModuleType : FileContext -> ( String, ( Int, VariableType, Range ) ) -> Bool
filterByModuleType fileContext =
    case fileContext.ast.moduleDefinition of
        EffectModule _ ->
            filterForEffectModule

        _ ->
            (always True)


filterForEffectModule : ( String, ( Int, VariableType, Range ) ) -> Bool
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
                |> (,) []
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
                ( masked, Dict.update k (Maybe.map (Tuple3.mapFirst ((+) 1))) x ) :: xs
            else
                ( masked, x ) :: flagVariable k xs


addUsedVariable : String -> UsedVariableContext -> UsedVariableContext
addUsedVariable x context =
    { context | activeScopes = flagVariable x context.activeScopes }


onFunctionOrValue : String -> UsedVariableContext -> UsedVariableContext
onFunctionOrValue x context =
    addUsedVariable x context


onRecordUpdate : RecordUpdate -> UsedVariableContext -> UsedVariableContext
onRecordUpdate recordUpdate context =
    addUsedVariable recordUpdate.name context


onOperatorAppliction : ( String, InfixDirection, Expression, Expression ) -> UsedVariableContext -> UsedVariableContext
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
                |> \c ->
                    function.declaration.arguments
                        |> List.concatMap patternToVars
                        |> flip pushScope c
                        |> f
                        |> popScope
                        |> unMaskVariable function.declaration.name.value
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
        |> (getDeclarationsVars >> withoutTopLevel)
        |> flip pushScope context
        |> f
        |> popScope


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
