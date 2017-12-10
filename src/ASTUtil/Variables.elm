module ASTUtil.Variables
    exposing
        ( VariableType(Defined, Imported, Pattern, TopLevel)
        , getImportsVars
        , getLetDeclarationsVars
        , getTopLevels
        , patternToUsedVars
        , patternToVars
        , patternToVarsInner
        , withoutTopLevel
        )

import Elm.Syntax.Base exposing (VariablePointer)
import Elm.Syntax.Declaration exposing (Declaration(..))
import Elm.Syntax.Exposing exposing (Exposing(..), TopLevelExpose(..))
import Elm.Syntax.Expression exposing (Expression(..), LetDeclaration(LetDestructuring, LetFunction))
import Elm.Syntax.File exposing (File)
import Elm.Syntax.Module exposing (Import)
import Elm.Syntax.Pattern exposing (Pattern(..), QualifiedNameRef)
import Elm.Syntax.Range exposing (Range)
import Elm.Syntax.Ranged exposing (Ranged)


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


getDeclarationsVars : List (Ranged Declaration) -> List ( VariablePointer, VariableType )
getDeclarationsVars =
    List.concatMap getDeclarationVars


getLetDeclarationsVars : List (Ranged LetDeclaration) -> List ( VariablePointer, VariableType )
getLetDeclarationsVars =
    List.concatMap getLetDeclarationVars


getImportsVars : List Import -> List ( VariablePointer, VariableType )
getImportsVars =
    List.concatMap getImportVars


getImportVars : Import -> List ( VariablePointer, VariableType )
getImportVars imp =
    getImportExposedVars imp.exposingList


getImportExposedVars : Maybe (Exposing (Ranged TopLevelExpose)) -> List ( VariablePointer, VariableType )
getImportExposedVars e =
    case e of
        Just (All _) ->
            []

        Nothing ->
            []

        Just (Explicit l) ->
            l
                |> List.concatMap
                    (\( r, exposed ) ->
                        case exposed of
                            InfixExpose x ->
                                [ ( VariablePointer x r, Imported ) ]

                            FunctionExpose x ->
                                [ ( VariablePointer x r, Imported ) ]

                            TypeOrAliasExpose x ->
                                [ ( VariablePointer x r, Imported ) ]

                            TypeExpose exposedType ->
                                case exposedType.constructors of
                                    Just (All _) ->
                                        []

                                    Nothing ->
                                        [ ( VariablePointer exposedType.name r, Imported ) ]

                                    Just (Explicit constructors) ->
                                        constructors
                                            |> List.map (uncurry (flip VariablePointer))
                                            |> List.map (flip (,) Imported)
                    )


getDeclarationVars : Ranged Declaration -> List ( VariablePointer, VariableType )
getDeclarationVars ( r, decl ) =
    case decl of
        FuncDecl f ->
            [ ( f.declaration.name, TopLevel ) ]

        AliasDecl _ ->
            []

        TypeDecl t ->
            List.map (\{ name, range } -> ( { value = name, range = range }, TopLevel )) t.constructors

        PortDeclaration p ->
            [ ( { value = p.name, range = r }, TopLevel ) ]

        InfixDeclaration _ ->
            []

        Destructuring pattern _ ->
            patternToVars pattern


getLetDeclarationVars : Ranged LetDeclaration -> List ( VariablePointer, VariableType )
getLetDeclarationVars ( _, decl ) =
    case decl of
        LetFunction f ->
            [ ( f.declaration.name, TopLevel ) ]

        LetDestructuring pattern _ ->
            patternToVars pattern


patternToUsedVars : Ranged Pattern -> List VariablePointer
patternToUsedVars ( range, p ) =
    case p of
        TuplePattern t ->
            List.concatMap patternToUsedVars t

        UnConsPattern l r ->
            patternToUsedVars l ++ patternToUsedVars r

        ListPattern l ->
            List.concatMap patternToUsedVars l

        NamedPattern qualifiedNameRef args ->
            qualifiedNameUsedVars qualifiedNameRef range ++ List.concatMap patternToUsedVars args

        AsPattern sub _ ->
            patternToUsedVars sub

        ParenthesizedPattern sub ->
            patternToUsedVars sub

        QualifiedNamePattern x ->
            qualifiedNameUsedVars x range

        RecordPattern _ ->
            []

        VarPattern _ ->
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


qualifiedNameUsedVars : QualifiedNameRef -> Range -> List VariablePointer
qualifiedNameUsedVars { moduleName, name } range =
    if moduleName == [] then
        [ { value = name, range = range } ]
    else
        []


patternToVars : Ranged Pattern -> List ( VariablePointer, VariableType )
patternToVars =
    patternToVarsInner True


patternToVarsInner : Bool -> Ranged Pattern -> List ( VariablePointer, VariableType )
patternToVarsInner isFirst ( range, p ) =
    let
        recur =
            patternToVarsInner False
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
            [ ( { value = x, range = range }
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

        ParenthesizedPattern sub ->
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
