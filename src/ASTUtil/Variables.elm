module ASTUtil.Variables exposing
    ( VariableType(..)
    , getImportsVars
    , getLetDeclarationsVars
    , getTopLevels
    , patternToUsedVars
    , patternToVars
    , patternToVarsInner
    , withoutTopLevel
    )

import Elm.Syntax.Declaration exposing (Declaration(..))
import Elm.Syntax.Exposing exposing (Exposing(..), TopLevelExpose(..))
import Elm.Syntax.Expression exposing (Expression(..), LetDeclaration(..))
import Elm.Syntax.File exposing (File)
import Elm.Syntax.Import exposing (Import)
import Elm.Syntax.Node as Node exposing (Node(..))
import Elm.Syntax.Pattern exposing (Pattern(..), QualifiedNameRef)
import Elm.Syntax.Range exposing (Range)


type VariableType
    = Imported
    | Pattern
    | Defined
    | TopLevel


withoutTopLevel : List ( Node String, VariableType ) -> List ( Node String, VariableType )
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


getTopLevels : File -> List ( Node String, VariableType )
getTopLevels file =
    List.concat
        [ getImportsVars file.imports
        , getDeclarationsVars file.declarations
        ]


getDeclarationsVars : List (Node Declaration) -> List ( Node String, VariableType )
getDeclarationsVars =
    List.concatMap getDeclarationVars


getLetDeclarationsVars : List (Node LetDeclaration) -> List ( Node String, VariableType )
getLetDeclarationsVars =
    List.concatMap getLetDeclarationVars


getImportsVars : List (Node Import) -> List ( Node String, VariableType )
getImportsVars =
    List.concatMap getImportVars


getImportVars : Node Import -> List ( Node String, VariableType )
getImportVars (Node _ imp) =
    getImportExposedVars <| Maybe.map Node.value imp.exposingList


getImportExposedVars : Maybe Exposing -> List ( Node String, VariableType )
getImportExposedVars e =
    case e of
        Just (All _) ->
            []

        Nothing ->
            []

        Just (Explicit l) ->
            l
                |> List.concatMap
                    (\(Node r exposed) ->
                        case exposed of
                            InfixExpose x ->
                                [ ( Node r x, Imported ) ]

                            FunctionExpose x ->
                                [ ( Node r x, Imported ) ]

                            TypeOrAliasExpose x ->
                                [ ( Node r x, Imported ) ]

                            TypeExpose exposedType ->
                                case exposedType.open of
                                    Just _ ->
                                        []

                                    Nothing ->
                                        [ ( Node r exposedType.name, Imported ) ]
                    )


getDeclarationVars : Node Declaration -> List ( Node String, VariableType )
getDeclarationVars (Node _ decl) =
    case decl of
        FunctionDeclaration f ->
            [ ( (Node.value f.declaration).name, TopLevel ) ]

        AliasDeclaration _ ->
            []

        CustomTypeDeclaration t ->
            List.map
                (\(Node _ { name }) -> ( name, TopLevel ))
                t.constructors

        PortDeclaration p ->
            [ ( p.name, TopLevel ) ]

        InfixDeclaration _ ->
            []

        Destructuring pattern _ ->
            patternToVars pattern


getLetDeclarationVars : Node LetDeclaration -> List ( Node String, VariableType )
getLetDeclarationVars (Node _ decl) =
    case decl of
        LetFunction f ->
            [ ( (Node.value f.declaration).name, TopLevel ) ]

        LetDestructuring pattern _ ->
            patternToVars pattern


patternToUsedVars : Node Pattern -> List (Node String)
patternToUsedVars (Node range p) =
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

        HexPattern _ ->
            []

        FloatPattern _ ->
            []


qualifiedNameUsedVars : QualifiedNameRef -> Range -> List (Node String)
qualifiedNameUsedVars { moduleName, name } range =
    if moduleName == [] then
        [ Node range name ]

    else
        []


patternToVars : Node Pattern -> List ( Node String, VariableType )
patternToVars =
    patternToVarsInner True


patternToVarsInner : Bool -> Node Pattern -> List ( Node String, VariableType )
patternToVarsInner isFirst (Node range p) =
    let
        recur =
            patternToVarsInner False
    in
    case p of
        TuplePattern t ->
            List.concatMap recur t

        RecordPattern r ->
            List.map (\a -> ( a, Pattern )) r

        UnConsPattern l r ->
            recur l ++ recur r

        ListPattern l ->
            List.concatMap recur l

        VarPattern x ->
            [ ( Node range x
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

        HexPattern _ ->
            []

        FloatPattern _ ->
            []
