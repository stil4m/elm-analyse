module Analyser.Checks.UnusedVariable exposing (..)

import AST.Types exposing (..)
import Inspector exposing (..)
import Dict exposing (Dict)
import Analyser.FileContext exposing (FileContext)


type alias Pointer =
    String


type alias Scope =
    Dict Pointer Int


type alias UsedVariableContext =
    { poppedScopes : List Scope
    , activeScopes : List Scope
    }


pushScope : List String -> UsedVariableContext -> UsedVariableContext
pushScope vars x =
    let
        y : Scope
        y =
            vars
                |> List.map (flip (,) 0)
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


scan : FileContext -> Int
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
                }
                fileContext.ast
                emptyContext
                |> Debug.log "Result"

        --TODO Do something with exposing List
        y =
            x.poppedScopes
                |> List.concatMap Dict.toList
                |> List.filter (Tuple.second >> (==) 0)
                |> List.map Tuple.first
                |> Debug.log ("Unused variables in " ++ fileContext.path)
    in
        1


flagVariable : String -> List Scope -> List Scope
flagVariable k l =
    case l of
        [] ->
            []

        x :: xs ->
            if Dict.member k x then
                (Dict.update k (Maybe.map ((+) 1)) x) :: xs
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
    addUsedVariable recordUpdate.name context


onFile : File -> UsedVariableContext -> UsedVariableContext
onFile file context =
    let
        decls =
            getDeclarationVars file.declarations
                |> Debug.log "Decls"

        preContext =
            pushScope decls context
    in
        preContext


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


getDeclarationVars : List Declaration -> List String
getDeclarationVars =
    List.concatMap
        (\x ->
            case x of
                FuncDecl f ->
                    [ f.declaration.name ]

                AliasDecl _ ->
                    []

                TypeDecl t ->
                    t.name :: (List.map .name t.cases)

                PortDeclaration p ->
                    [ p.name ]

                InfixDeclaration i ->
                    [ i.operator ]

                Destructuring p _ ->
                    patternToVars p
        )


patternToVars : Pattern -> List String
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
