module Analyser.Checks.Variables exposing (getTopLevels, getDeclarationsVars, getImportsVars, patternToVars, patternToUsedVars)

import AST.Ranges exposing (Range, emptyRange)
import AST.Types exposing (Declaration(..), Expose(..), Exposure(..), File, Import, Pattern(..), QualifiedNameRef, VariablePointer)


getTopLevels : File -> List VariablePointer
getTopLevels file =
    List.concat
        [ getImportsVars file.imports
        , getDeclarationsVars file.declarations
        ]


getDeclarationsVars : List Declaration -> List VariablePointer
getDeclarationsVars =
    List.concatMap getDeclarationVars


getImportsVars : List Import -> List VariablePointer
getImportsVars =
    List.concatMap getImportVars


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
                            InfixExpose _ _ ->
                                --TODO
                                []

                            FunctionExpose x r ->
                                [ VariablePointer x r ]

                            TypeOrAliasExpose _ _ ->
                                []

                            TypeExpose exposedType ->
                                case exposedType.constructors of
                                    All _ ->
                                        []

                                    None ->
                                        []

                                    --TODO
                                    Explicit constructors ->
                                        constructors |> List.map (uncurry VariablePointer)
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


qualifiedNameUsedVars : QualifiedNameRef -> List VariablePointer
qualifiedNameUsedVars { moduleName, name, range } =
    if moduleName == [] then
        [ { value = name, range = range } ]
    else
        []


patternToUsedVars : Pattern -> List VariablePointer
patternToUsedVars p =
    case p of
        TuplePattern t ->
            List.concatMap patternToUsedVars t

        RecordPattern r ->
            r

        UnConsPattern l r ->
            patternToUsedVars l ++ patternToUsedVars r

        ListPattern l ->
            List.concatMap patternToUsedVars l

        VarPattern x ->
            [ x ]

        NamedPattern qualifiedNameRef args ->
            qualifiedNameUsedVars qualifiedNameRef ++ List.concatMap patternToUsedVars args

        AsPattern sub name ->
            name :: patternToUsedVars sub

        ParentisizedPattern sub ->
            patternToUsedVars sub

        QualifiedNamePattern x ->
            qualifiedNameUsedVars x

        AllPattern ->
            []

        UnitPattern ->
            []

        CharPattern _ ->
            []

        StringPattern _ ->
            []

        IntPattern _ ->
            []

        FloatPattern _ ->
            []


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

        QualifiedNamePattern _ ->
            []

        AllPattern ->
            []

        UnitPattern ->
            []

        CharPattern _ ->
            []

        StringPattern _ ->
            []

        IntPattern _ ->
            []

        FloatPattern _ ->
            []
