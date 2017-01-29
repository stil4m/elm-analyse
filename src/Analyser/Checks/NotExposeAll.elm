module Analyser.Checks.NotExposeAll exposing (..)

import AST.Types exposing (..)
import AST.Util
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages exposing (..)
import Inspector exposing (..)


type alias ExposeAllContext =
    List Range


scan : FileContext -> List Message
scan fileContext =
    let
        x : ExposeAllContext
        x =
            Inspector.inspect
                { defaultConfig | onFile = Inner onFile }
                fileContext.ast
                []
    in
        x |> List.map (ExposeAll fileContext.path)


onFile : (ExposeAllContext -> ExposeAllContext) -> File -> ExposeAllContext -> ExposeAllContext
onFile _ file context =
    case AST.Util.fileExposingList file |> Maybe.withDefault None of
        None ->
            []

        All x ->
            [ x ]

        Explicit x ->
            x
                |> List.filterMap
                    (\y ->
                        case y of
                            TypeExpose _ constructors ->
                                case constructors of
                                    All y ->
                                        Just y

                                    _ ->
                                        Nothing

                            _ ->
                                Nothing
                    )


getDeclarationVars : List Declaration -> List VariablePointer
getDeclarationVars =
    List.concatMap
        (\x ->
            case x of
                FuncDecl f ->
                    --TODO
                    [ f.declaration.name ]

                AliasDecl _ ->
                    []

                TypeDecl t ->
                    (List.map (\{ name, range } -> { value = name, range = range }) t.constructors)

                PortDeclaration p ->
                    --TODO
                    [ { value = p.name, range = emptyRange } ]

                InfixDeclaration i ->
                    --TODO
                    [ { value = i.operator, range = emptyRange } ]

                DestructuringDeclaration destructuring ->
                    patternToVars destructuring.pattern
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
