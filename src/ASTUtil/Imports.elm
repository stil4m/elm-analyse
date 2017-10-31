module ASTUtil.Imports exposing (FunctionReference, buildImportInformation, findImportWithRange, naiveStringifyImport, removeRangeFromImport)

import AST.Ranges as Ranges
import Elm.Syntax.Base exposing (..)
import Elm.Syntax.Exposing as Exposing exposing (..)
import Elm.Syntax.File exposing (..)
import Elm.Syntax.Module exposing (..)
import Elm.Syntax.Range exposing (Range)
import List.Extra as List


type alias FunctionReference =
    { moduleName : ModuleName
    , exposesRegex : Bool
    }


{-| Will look for an import within the file that includes a range. Will return a `Nothing` when no such import exists.
-}
findImportWithRange : File -> Range -> Maybe Import
findImportWithRange ast range =
    ast.imports
        |> List.filter (.range >> Ranges.containsRange range)
        |> List.head


buildImportInformation : ModuleName -> String -> File -> Maybe FunctionReference
buildImportInformation moduleName function file =
    file.imports
        |> List.filter (\i -> i.moduleName == moduleName)
        |> List.head
        |> Maybe.map
            (\i ->
                { moduleName = Maybe.withDefault i.moduleName i.moduleAlias
                , exposesRegex = Maybe.map (Exposing.exposesFunction function) i.exposingList |> Maybe.withDefault False
                }
            )


naiveStringifyImport : Import -> String
naiveStringifyImport imp =
    String.concat <|
        [ "import "
        , String.join "." imp.moduleName
        , Maybe.withDefault "" <| Maybe.map (String.join "." >> (++) " as ") imp.moduleAlias
        , stringifyExposingList imp.exposingList
        ]


stringifyExposingList : Maybe (Exposing TopLevelExpose) -> String
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
                                    rangesOnDifferentLines (List.map Exposing.topLevelExposeRange xs)

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


stringifyExpose : TopLevelExpose -> String
stringifyExpose expose =
    case expose of
        InfixExpose s _ ->
            "(" ++ s ++ ")"

        FunctionExpose s _ ->
            s

        TypeOrAliasExpose s _ ->
            s

        TypeExpose exposedType ->
            stringifyExposedType exposedType


stringifyExposedType : ExposedType -> String
stringifyExposedType { name, constructors } =
    name
        ++ (case constructors of
                Nothing ->
                    ""

                Just (All _) ->
                    "(..)"

                Just (Explicit explicits) ->
                    case explicits of
                        [] ->
                            ""

                        xs ->
                            let
                                areOnDifferentLines =
                                    rangesOnDifferentLines (List.map Tuple.second xs)

                                seperator =
                                    if areOnDifferentLines then
                                        "\n    , "
                                    else
                                        ", "
                            in
                            "(" ++ (String.join seperator <| List.map Tuple.first explicits) ++ ")"
           )


removeRangeFromImport : Range -> Import -> Import
removeRangeFromImport range imp =
    { imp | exposingList = Maybe.andThen (removeRangeFromExposingList range) imp.exposingList }


removeRangeFromExposingList : Range -> Exposing TopLevelExpose -> Maybe (Exposing TopLevelExpose)
removeRangeFromExposingList range exp =
    case exp of
        All r ->
            if r == range then
                Nothing
            else
                Just (All r)

        Explicit exposedTypes ->
            case List.filterMap (removeRangeFromExpose range) exposedTypes of
                [] ->
                    Nothing

                x ->
                    Just (Explicit x)


removeRangeFromExpose : Range -> TopLevelExpose -> Maybe TopLevelExpose
removeRangeFromExpose range expose =
    case expose of
        InfixExpose x r ->
            if r == range then
                Nothing
            else
                Just (InfixExpose x r)

        FunctionExpose x r ->
            if r == range then
                Nothing
            else
                Just (FunctionExpose x r)

        TypeOrAliasExpose x r ->
            if r == range then
                Nothing
            else
                Just (TypeOrAliasExpose x r)

        TypeExpose exposedType ->
            Just <|
                TypeExpose <|
                    { exposedType | constructors = Maybe.andThen (removeRangeFromConstructors range) exposedType.constructors }


removeRangeFromConstructors : Range -> Exposing ValueConstructorExpose -> Maybe (Exposing ValueConstructorExpose)
removeRangeFromConstructors range exp =
    case exp of
        All r ->
            if r == range then
                Nothing
            else
                Just (All r)

        Explicit pairs ->
            case List.filter (Tuple.second >> (/=) range) pairs of
                [] ->
                    Nothing

                x ->
                    Just (Explicit x)
