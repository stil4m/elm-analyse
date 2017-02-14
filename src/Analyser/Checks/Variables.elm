module Analyser.Checks.Variables exposing (VariableType(Imported, Defined, Pattern, TopLevel), getTopLevels, withoutTopLevel, getDeclarationsVars, getImportsVars, patternToVars, patternToVarInner, patternToUsedVars)

import AST.Ranges exposing (Range, emptyRange)
import AST.Types exposing (Declaration(..), Expose(..), Exposure(..), File, Import, Pattern(..), QualifiedNameRef, VariablePointer)


type VariableType
    = Imported
    | Pattern
    | Defined
    | TopLevel


withoutTopLevel : List ( VariablePointer, VariableType ) -> List ( VariablePointer, VariableType )
withoutTopLevel =
    let
        f (( pointer, variableType ) as pair) =
            case variableType of
                TopLevel ->
                    ( pointer, Defined )

                _ ->
                    pair
    in
        List.map f


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
            [ ( f.declaration.name, TopLevel ) ]

        AliasDecl _ ->
            []

        TypeDecl t ->
            (List.map (\{ name, range } -> ( { value = name, range = range }, TopLevel )) t.constructors)

        PortDeclaration p ->
            --TODO Range + Test
            [ ( { value = p.name, range = emptyRange }, TopLevel ) ]

        InfixDeclaration i ->
            --TODO Range + Test
            [ ( { value = i.operator, range = emptyRange }, TopLevel ) ]

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
patternToVars =
    patternToVarInner True


patternToVarInner : Bool -> Pattern -> List ( VariablePointer, VariableType )
patternToVarInner isFirst p =
    let
        recur =
            patternToVarInner False
    in
        case p of
            TuplePattern t ->
                List.concatMap recur t

            RecordPattern r ->
                List.map (flip (,) Pattern) r

            UnConsPattern l r ->
                recur l ++ recur r

            ListPattern l ->
                List.concatMap recur l

            VarPattern x ->
                [ ( x
                  , if isFirst then
                        Defined
                    else
                        Pattern
                  )
                ]

            NamedPattern _ args ->
                List.concatMap recur args

            AsPattern sub name ->
                ( name, Pattern ) :: recur sub

            ParentisizedPattern sub ->
                recur sub

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
