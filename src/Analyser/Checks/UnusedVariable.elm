module Analyser.Checks.UnusedVariable exposing (..)

import AST.Types exposing (..)
import Inspector exposing (..)
import Dict exposing (Dict)


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
            vars |> List.map (flip (,) 0) |> Dict.fromList
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


scan : File -> Int
scan file =
    let
        x : UsedVariableContext
        x =
            Inspector.inspect
                { defaultConfig
                    | onFile = Pre onFile
                    , onFunction = Inner onFunction
                }
                file
                emptyContext
                |> Debug.log "Result"
    in
        1


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


onLet : (UsedVariableContext -> UsedVariableContext) -> LetBlock -> UsedVariableContext -> UsedVariableContext
onLet f letBlock context =
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
