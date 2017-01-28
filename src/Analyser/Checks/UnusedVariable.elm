module Analyser.Checks.UnusedVariable exposing (..)

import AST.Types exposing (..)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages exposing (..)
import Dict exposing (Dict)
import Inspector exposing (..)
import Tuple2


type alias Scope =
    Dict String ( Int, Range )


type alias UsedVariableContext =
    { poppedScopes : List Scope
    , activeScopes : List Scope
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
                    , onFunctionOrValue = Post onFunctionOrValue
                    , onRecordAccess = Post onRecordAccess
                    , onRecordUpdate = Post onRecordUpdate
                }
                fileContext.ast
                emptyContext

        --TODO Do something with exposing List
        y =
            x.poppedScopes
                |> List.concatMap Dict.toList
                |> List.filter (Tuple.second >> Tuple.first >> (==) 0)
                |> List.map (\( x, ( _, y ) ) -> UnusedVariable fileContext.path x y |> Warning)
    in
        y


pushScope : List VariablePointer -> UsedVariableContext -> UsedVariableContext
pushScope vars x =
    let
        y : Scope
        y =
            vars
                |> List.map (\x -> ( x.value, ( 0, x.range ) ))
                |> Dict.fromList
    in
        { x | activeScopes = y :: x.activeScopes }


popScope : UsedVariableContext -> UsedVariableContext
popScope x =
    { x
        | activeScopes = List.drop 1 x.activeScopes
        , poppedScopes =
            List.head x.activeScopes
                |> Maybe.map
                    (\y ->
                        if Dict.isEmpty y then
                            x.poppedScopes
                        else
                            y :: x.poppedScopes
                    )
                |> Maybe.withDefault x.poppedScopes
    }


emptyContext : UsedVariableContext
emptyContext =
    { poppedScopes = [], activeScopes = [] }


flagVariable : String -> List Scope -> List Scope
flagVariable k l =
    case l of
        [] ->
            []

        x :: xs ->
            if Dict.member k x then
                (Dict.update k (Maybe.map (Tuple2.mapFirst ((+) 1))) x) :: xs
            else
                x :: (flagVariable k xs)


addUsedVariable : String -> UsedVariableContext -> UsedVariableContext
addUsedVariable x context =
    { context | activeScopes = flagVariable x context.activeScopes }


onFunctionOrValue : String -> UsedVariableContext -> UsedVariableContext
onFunctionOrValue x context =
    addUsedVariable x context


onRecordAccess : List String -> UsedVariableContext -> UsedVariableContext
onRecordAccess x context =
    List.head x
        |> Maybe.map (flip addUsedVariable context)
        |> Maybe.withDefault context


onRecordUpdate : RecordUpdate -> UsedVariableContext -> UsedVariableContext
onRecordUpdate recordUpdate context =
    let
        _ =
            Debug.log "onRecordUpdate" recordUpdate
    in
        addUsedVariable recordUpdate.name context


onFile : File -> UsedVariableContext -> UsedVariableContext
onFile file context =
    getDeclarationVars file.declarations
        |> flip pushScope context


onFunction : (UsedVariableContext -> UsedVariableContext) -> Function -> UsedVariableContext -> UsedVariableContext
onFunction f function context =
    let
        preContext =
            function.declaration.arguments
                |> List.concatMap patternToVars
                |> flip pushScope context

        postContext =
            f preContext
    in
        postContext |> popScope


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
    let
        preContext =
            letBlock.declarations
                |> getDeclarationVars
                |> flip pushScope context

        postContext =
            f preContext
    in
        postContext |> popScope


onCase : (UsedVariableContext -> UsedVariableContext) -> Case -> UsedVariableContext -> UsedVariableContext
onCase f caze context =
    let
        preContext =
            (Tuple.first caze)
                |> patternToVars
                |> flip pushScope context

        postContext =
            f preContext
    in
        postContext |> popScope


getDeclarationVars : List Declaration -> List VariablePointer
getDeclarationVars =
    List.concatMap
        (\x ->
            case x of
                FuncDecl f ->
                    --TODO
                    [ { value = f.declaration.name, range = emptyRange } ]

                AliasDecl _ ->
                    []

                TypeDecl t ->
                    --TODO
                    { value = t.name, range = emptyRange }
                        :: (List.map (\x -> { value = x.name, range = emptyRange }) t.cases)

                PortDeclaration p ->
                    --TODO
                    [ { value = p.name, range = emptyRange } ]

                InfixDeclaration i ->
                    --TODO
                    [ { value = i.operator, range = emptyRange } ]

                Destructuring p _ ->
                    patternToVars p
        )


patternToVars : Pattern -> List VariablePointer
patternToVars p =
    case p of
        TuplePattern t ->
            List.concatMap patternToVars t

        RecordPattern r ->
            r

        UnConsPattern l r ->
            patternToVars l ++ patternToVars r

        ListPattern l ->
            List.concatMap patternToVars l

        VarPattern x ->
            [ x ]

        NamedPattern _ args ->
            List.concatMap patternToVars args

        AsPattern sub name ->
            name :: (patternToVars sub)

        ParentisizedPattern sub ->
            patternToVars sub

        QualifiedNamePattern _ ->
            []

        AllPattern ->
            []

        UnitPattern ->
            []

        StringPattern _ ->
            []

        CharPattern _ ->
            []

        IntPattern _ ->
            []

        FloatPattern _ ->
            []
