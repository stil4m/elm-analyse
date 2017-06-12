module ASTUtil.Variables exposing (..)

import AST.Ranges exposing (emptyRange)
import Elm.Syntax.Range exposing (Range)
import Elm.Syntax.File exposing (..)
import Elm.Syntax.Module exposing (..)
import Elm.Syntax.Expression exposing (..)
import Elm.Syntax.Base exposing (..)
import Elm.Syntax.Pattern exposing (..)
import Elm.Syntax.Declaration exposing (..)
import Elm.Syntax.Exposing exposing (..)


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


getLetDeclarationsVars : List LetDeclaration -> List ( VariablePointer, VariableType )
getLetDeclarationsVars =
    List.concatMap getLetDeclarationVars


getImportsVars : List Import -> List ( VariablePointer, VariableType )
getImportsVars =
    List.concatMap getImportVars


getImportVars : Import -> List ( VariablePointer, VariableType )
getImportVars imp =
    getImportExposedVars imp.exposingList


getImportExposedVars : Exposing TopLevelExpose -> List ( VariablePointer, VariableType )
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
                            InfixExpose x r ->
                                [ ( VariablePointer x r, Imported ) ]

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

        Destructuring pattern _ ->
            patternToVars pattern


getLetDeclarationVars : LetDeclaration -> List ( VariablePointer, VariableType )
getLetDeclarationVars decl =
    case decl of
        LetFunction f ->
            [ ( f.declaration.name, TopLevel ) ]

        LetDestructuring pattern _ ->
            patternToVars pattern


patternToUsedVars : Pattern -> List VariablePointer
patternToUsedVars p =
    case p of
        TuplePattern t _ ->
            List.concatMap patternToUsedVars t

        UnConsPattern l r _ ->
            patternToUsedVars l ++ patternToUsedVars r

        ListPattern l _ ->
            List.concatMap patternToUsedVars l

        NamedPattern qualifiedNameRef args range ->
            qualifiedNameUsedVars qualifiedNameRef range ++ List.concatMap patternToUsedVars args

        AsPattern sub _ _ ->
            patternToUsedVars sub

        ParenthesizedPattern sub _ ->
            patternToUsedVars sub

        QualifiedNamePattern x range ->
            qualifiedNameUsedVars x range

        RecordPattern _ _ ->
            []

        VarPattern _ _ ->
            []

        AllPattern _ ->
            []

        UnitPattern _ ->
            []

        CharPattern _ _ ->
            []

        StringPattern _ _ ->
            []

        IntPattern _ _ ->
            []

        FloatPattern _ _ ->
            []


qualifiedNameUsedVars : QualifiedNameRef -> Range -> List VariablePointer
qualifiedNameUsedVars { moduleName, name } range =
    if moduleName == [] then
        [ { value = name, range = range } ]
    else
        []


patternToVars : Pattern -> List ( VariablePointer, VariableType )
patternToVars =
    patternToVarsInner True


patternToVarsInner : Bool -> Pattern -> List ( VariablePointer, VariableType )
patternToVarsInner isFirst p =
    let
        recur =
            patternToVarsInner False
    in
        case p of
            TuplePattern t _ ->
                List.concatMap recur t

            RecordPattern r _ ->
                List.map (flip (,) Pattern) r

            UnConsPattern l r _ ->
                recur l ++ recur r

            ListPattern l _ ->
                List.concatMap recur l

            VarPattern x r ->
                [ ( { value = x, range = r }
                  , if isFirst then
                        Defined
                    else
                        Pattern
                  )
                ]

            NamedPattern _ args _ ->
                List.concatMap recur args

            AsPattern sub name _ ->
                ( name, Pattern ) :: recur sub

            ParenthesizedPattern sub _ ->
                recur sub

            QualifiedNamePattern _ _ ->
                []

            AllPattern _ ->
                []

            UnitPattern _ ->
                []

            CharPattern _ _ ->
                []

            StringPattern _ _ ->
                []

            IntPattern _ _ ->
                []

            FloatPattern _ _ ->
                []
