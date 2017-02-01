module Interfaces.Interface exposing (Interface, ExposedInterface(Function, Type, Alias, Operator), doesExposeFunction, getOperators, build, doesExposeAlias)

import AST.Types as AST
import List.Extra


type alias Interface =
    List ExposedInterface


type ExposedInterface
    = Function String
    | Type ( String, List String )
    | Alias String
    | Operator AST.Infix


doesExposeAlias : String -> Interface -> Bool
doesExposeAlias k interface =
    interface
        |> List.any
            (\x ->
                case x of
                    Alias l ->
                        k == l

                    _ ->
                        False
            )


doesExposeFunction : String -> Interface -> Bool
doesExposeFunction k interface =
    interface
        |> List.any
            (\x ->
                case x of
                    Function l ->
                        k == l

                    Type ( _, constructors ) ->
                        List.member k constructors

                    _ ->
                        False
            )


getOperators : Interface -> List AST.Infix
getOperators =
    List.filterMap
        (\i ->
            case i of
                Operator o ->
                    Just o

                _ ->
                    Nothing
        )


build : AST.File -> Interface
build file =
    let
        fileDefinitionList =
            fileToDefinitions file

        moduleExposure =
            moduleExposingList file.moduleDefinition
    in
        case moduleExposure of
            AST.None ->
                []

            AST.Explicit x ->
                buildInterfaceFromExplicit x fileDefinitionList

            AST.All _ ->
                fileDefinitionList |> List.map Tuple.second


lookupForDefinition : String -> List ( String, ExposedInterface ) -> Maybe ExposedInterface
lookupForDefinition key =
    List.filter (Tuple.first >> (==) key) >> List.head >> Maybe.map Tuple.second


buildInterfaceFromExplicit : List AST.Expose -> List ( String, ExposedInterface ) -> Interface
buildInterfaceFromExplicit x fileDefinitionList =
    x
        |> List.filterMap
            (\expose ->
                case expose of
                    AST.InfixExpose k ->
                        lookupForDefinition k fileDefinitionList

                    AST.DefinitionExpose s ->
                        lookupForDefinition s fileDefinitionList
                            |> Maybe.map (ifType (\( name, _ ) -> Type ( name, [] )))

                    AST.TypeExpose n vals ->
                        case vals of
                            AST.None ->
                                Just <| Type ( n, [] )

                            AST.All _ ->
                                lookupForDefinition n fileDefinitionList

                            AST.Explicit v ->
                                Just <| Type ( n, v )
            )


ifType : (( String, List String ) -> ExposedInterface) -> ExposedInterface -> ExposedInterface
ifType f i =
    case i of
        Type t ->
            f t

        _ ->
            i


fileToDefinitions : AST.File -> List ( String, ExposedInterface )
fileToDefinitions file =
    let
        allDeclarations =
            file.declarations
                |> List.filterMap
                    (\decl ->
                        case decl of
                            AST.TypeDecl t ->
                                Just ( t.name, Type ( t.name, t.constructors |> List.map .name ) )

                            AST.AliasDecl a ->
                                Just ( a.name, Alias a.name )

                            AST.PortDeclaration p ->
                                Just ( p.name, Function p.name )

                            AST.FuncDecl f ->
                                if f.declaration.operatorDefinition then
                                    Just ( f.declaration.name.value, Operator { operator = f.declaration.name.value, precedence = 5, direction = AST.Left } )
                                else
                                    Just ( f.declaration.name.value, Function f.declaration.name.value )

                            AST.InfixDeclaration i ->
                                Just ( i.operator, Operator i )

                            AST.DestructuringDeclaration _ ->
                                --TODO As expression?
                                Nothing
                    )

        getValidOperatorInterface : ExposedInterface -> ExposedInterface -> Maybe ExposedInterface
        getValidOperatorInterface t1 t2 =
            case ( t1, t2 ) of
                ( Operator x, Operator y ) ->
                    if x.precedence == 5 && x.direction == AST.Left then
                        Just <| Operator y
                    else
                        Just <| Operator x

                _ ->
                    Nothing

        resolveGroup g =
            case g of
                [] ->
                    Nothing

                [ x ] ->
                    Just x

                [ ( n1, t1 ), ( _, t2 ) ] ->
                    getValidOperatorInterface t1 t2
                        |> Maybe.map ((,) n1)

                _ ->
                    Nothing
    in
        allDeclarations
            |> List.map Tuple.first
            |> List.Extra.unique
            |> List.map
                (\x ->
                    ( x
                    , allDeclarations
                        |> List.filter (Tuple.first >> (==) x)
                    )
                )
            |> List.filterMap (Tuple.second >> resolveGroup)


{-| TODO To other module
-}
moduleExposingList : AST.Module -> AST.Exposure AST.Expose
moduleExposingList m =
    case m of
        AST.NormalModule x ->
            x.exposingList

        AST.PortModule x ->
            x.exposingList

        AST.EffectModule x ->
            x.exposingList

        AST.NoModule ->
            AST.None
