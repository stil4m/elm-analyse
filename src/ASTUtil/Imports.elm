module ASTUtil.Imports exposing (FunctionReference, buildImportInformation, findImportWithRange, naiveStringifyImport, removeRangeFromImport)

import AST.Ranges as Ranges
import Elm.Syntax.Exposing exposing (ExposedType, Exposing(..), TopLevelExpose(..))
import Elm.Syntax.File exposing (File)
import Elm.Syntax.Import exposing (Import)
import Elm.Syntax.ModuleName exposing (ModuleName)
import Elm.Syntax.Node as Node exposing (Node(..))
import Elm.Syntax.Range exposing (Range)
import List.Extra as List


type alias FunctionReference =
    { moduleName : ModuleName
    , exposesRegex : Bool
    }


{-| Will look for an import within the file that includes a range. Will return a `Nothing` when no such import exists.
-}
findImportWithRange : File -> Range -> Maybe (Node Import)
findImportWithRange ast range =
    ast.imports
        |> List.filter (Node.range >> Ranges.containsRange range)
        |> List.head


buildImportInformation : ModuleName -> String -> File -> Maybe FunctionReference
buildImportInformation moduleName function file =
    file.imports
        |> List.filter (Node.value >> (\i -> Node.value i.moduleName == moduleName))
        |> List.head
        |> Maybe.map (Node.value >> importToFunctionReference function)


importToFunctionReference : String -> Import -> FunctionReference
importToFunctionReference function i =
    { moduleName = Node.value <| Maybe.withDefault i.moduleName i.moduleAlias
    , exposesRegex =
        i.exposingList
            |> Maybe.map (Node.value >> exposesFunction function)
            |> Maybe.withDefault False
    }


{-| TODO
-}
exposesFunction : String -> Exposing -> Bool
exposesFunction s exposure =
    case exposure of
        All _ ->
            True

        Explicit l ->
            List.any
                (\(Node _ x) ->
                    case x of
                        FunctionExpose fun ->
                            fun == s

                        _ ->
                            False
                )
                l


naiveStringifyImport : Import -> String
naiveStringifyImport imp =
    String.concat <|
        [ "import "
        , String.join "." <| Node.value imp.moduleName
        , Maybe.withDefault "" <| Maybe.map (Node.value >> String.join "." >> (++) " as ") <| imp.moduleAlias
        , stringifyExposingList <| Maybe.map Node.value imp.exposingList
        ]


stringifyExposingList : Maybe Exposing -> String
stringifyExposingList exp =
    case exp of
        Nothing ->
            ""

        Just (All _) ->
            " exposing (..)"

        Just (Explicit explicits) ->
            " exposing "
                ++ (case explicits of
                        [] ->
                            ""

                        xs ->
                            let
                                areOnDifferentLines =
                                    rangesOnDifferentLines (List.map Node.range xs)

                                seperator =
                                    if areOnDifferentLines then
                                        "\n    , "

                                    else
                                        ", "
                            in
                            "(" ++ (List.map stringifyExpose explicits |> String.join seperator) ++ ")"
                   )


rangesOnDifferentLines : List Range -> Bool
rangesOnDifferentLines ranges =
    let
        starts =
            List.map (.start >> .row) ranges
    in
    List.length (List.unique starts) == List.length starts


stringifyExpose : Node TopLevelExpose -> String
stringifyExpose (Node _ expose) =
    case expose of
        InfixExpose s ->
            "(" ++ s ++ ")"

        FunctionExpose s ->
            s

        TypeOrAliasExpose s ->
            s

        TypeExpose exposedType ->
            stringifyExposedType exposedType


stringifyExposedType : ExposedType -> String
stringifyExposedType { name, open } =
    name
        ++ (case open of
                Nothing ->
                    ""

                Just _ ->
                    "(..)"
           )


removeRangeFromImport : Range -> Import -> Import
removeRangeFromImport range imp =
    { imp | exposingList = Maybe.andThen (removeRangeFromExposingList range) imp.exposingList }


removeRangeFromExposingList : Range -> Node Exposing -> Maybe (Node Exposing)
removeRangeFromExposingList range (Node er exp) =
    case exp of
        All r ->
            if r == range then
                Nothing

            else
                Just (Node er (All r))

        Explicit exposedTypes ->
            case List.filterMap (removeRangeFromExpose range) exposedTypes of
                [] ->
                    Nothing

                x ->
                    Just (Node er (Explicit x))


removeRangeFromExpose : Range -> Node TopLevelExpose -> Maybe (Node TopLevelExpose)
removeRangeFromExpose range (Node r expose) =
    Maybe.map (\b -> Node r b) <|
        case expose of
            InfixExpose x ->
                if r == range then
                    Nothing

                else
                    Just (InfixExpose x)

            FunctionExpose x ->
                if r == range then
                    Nothing

                else
                    Just (FunctionExpose x)

            TypeOrAliasExpose x ->
                if r == range then
                    Nothing

                else
                    Just (TypeOrAliasExpose x)

            TypeExpose exposedType ->
                Just
                    (TypeExpose
                        { exposedType
                            | open =
                                if exposedType.open == Just range then
                                    Nothing

                                else
                                    exposedType.open
                        }
                    )
