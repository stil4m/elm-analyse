module Analyser.Checks.Variables exposing (VariableType(Imported, Defined), getTopLevels, getDeclarationsVars, getImportsVars, patternToVars, patternToUsedVars)

import AST.Ranges exposing (Range, emptyRange)
import AST.Types exposing (Declaration(..), Expose(..), Exposure(..), File, Import, Pattern(..), QualifiedNameRef, VariablePointer)


type VariableType
    = Imported
    | Defined


getTopLevels : File -> List ( VariablePointer, VariableType )
getTopLevels file =
    List.concat
        [ getImportsVars file.imports
        , getDeclarationsVars file.declarations
        ]


getDeclarationsVars : List Declaration -> List ( VariablePointer, VariableType )
getDeclarationsVars =
    List.concatMap getDeclarationVars


getImportsVars : List Import -> List ( VariablePointer, VariableType )
getImportsVars =
    List.concatMap getImportVars


getImportVars : Import -> List ( VariablePointer, VariableType )
getImportVars imp =
    getImportExposedVars imp.exposingList


getImportExposedVars : Exposure Expose -> List ( VariablePointer, VariableType )
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
                                [ ( VariablePointer x r, Imported ) ]

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
                                        constructors |> List.map (uncurry VariablePointer >> flip (,) Imported)
                    )


getDeclarationVars : Declaration -> List ( VariablePointer, VariableType )
getDeclarationVars decl =
    case decl of
        FuncDecl f ->
            [ ( f.declaration.name, Defined ) ]

        AliasDecl _ ->
            []

        TypeDecl t ->
            (List.map (\{ name, range } -> ( { value = name, range = range }, Defined )) t.constructors)

        PortDeclaration p ->
            --TODO Range + Test
            [ ( { value = p.name, range = emptyRange }, Defined ) ]

        InfixDeclaration i ->
            --TODO Range + Test
            [ ( { value = i.operator, range = emptyRange }, Defined ) ]

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


patternToVars : Pattern -> List ( VariablePointer, VariableType )
patternToVars p =
    case p of
        TuplePattern t ->
            List.concatMap patternToVars t

        RecordPattern r ->
            List.map (flip (,) Defined) r

        UnConsPattern l r ->
            patternToVars l ++ patternToVars r

        ListPattern l ->
            List.concatMap patternToVars l

        VarPattern x ->
            [ ( x, Defined ) ]

        NamedPattern _ args ->
            List.concatMap patternToVars args

        AsPattern sub name ->
            ( name, Defined ) :: patternToVars sub

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
