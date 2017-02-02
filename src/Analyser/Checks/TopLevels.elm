module Analyaser.Checks.TopLevels exposing (getTopLevels)

import AST.Types exposing (Import, Exposure(..), Expose(..), File, Declaration(..), VariablePointer, Pattern(..))
import AST.Ranges exposing (..)


getTopLevels : File -> List VariablePointer
getTopLevels file =
    List.concat
        [ List.concatMap getImportVars file.imports
        , List.concatMap getDeclarationVars file.declarations
        ]


getImportVars : Import -> List VariablePointer
getImportVars imp =
    getImportExposedVars imp.exposingList


getImportExposedVars : Exposure Expose -> List VariablePointer
getImportExposedVars e =
    case e of
        All _ ->
            []

        None ->
            []

        Explicit l ->
            l
                |> List.concatMap
                    (\exposed ->
                        case exposed of
                            InfixExpose inf ->
                                --TODO
                                []

                            DefinitionExpose k ->
                                -- TODO No types, only functions
                                [ VariablePointer k emptyRange ]

                            TypeExpose t ts ->
                                case ts of
                                    All _ ->
                                        []

                                    None ->
                                        []

                                    --TODO
                                    Explicit tsx ->
                                        tsx |> List.map (flip VariablePointer emptyRange)
                    )


getDeclarationVars : Declaration -> List VariablePointer
getDeclarationVars decl =
    case decl of
        FuncDecl f ->
            [ f.declaration.name ]

        AliasDecl _ ->
            []

        TypeDecl t ->
            (List.map (\{ name, range } -> { value = name, range = range }) t.constructors)

        PortDeclaration p ->
            --TODO Range + Test
            [ { value = p.name, range = emptyRange } ]

        InfixDeclaration i ->
            --TODO Range + Test
            [ { value = i.operator, range = emptyRange } ]

        DestructuringDeclaration destructuring ->
            patternToVars destructuring.pattern


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
            name :: patternToVars sub

        ParentisizedPattern sub ->
            patternToVars sub

        _ ->
            []
