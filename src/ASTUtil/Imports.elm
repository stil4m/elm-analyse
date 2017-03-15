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
                , exposesRegex = Exposing.exposesFunction function i.exposingList
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


stringifyExposingList : Exposing TopLevelExpose -> String
stringifyExposingList exp =
    case exp of
        None ->
            ""

        All _ ->
            " exposing (..)"

        Explicit explicits ->
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
                None ->
                    ""

                All _ ->
                    "(..)"

                Explicit explicits ->
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
    { imp | exposingList = removeRangeFromExposingList range imp.exposingList }


removeRangeFromExposingList : Range -> Exposing TopLevelExpose -> Exposing TopLevelExpose
removeRangeFromExposingList range exp =
    case exp of
        None ->
            None

        All r ->
            if r == range then
                None
            else
                All r

        Explicit exposedTypes ->
            case List.filterMap (removeRangeFromExpose range) exposedTypes of
                [] ->
                    None

                x ->
                    Explicit x


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
                    { exposedType | constructors = removeRangeFromConstructors range exposedType.constructors }


removeRangeFromConstructors : Range -> Exposing ValueConstructorExpose -> Exposing ValueConstructorExpose
removeRangeFromConstructors range exp =
    case exp of
        None ->
            None

        All r ->
            if r == range then
                None
            else
                All r

        Explicit pairs ->
            case List.filter (Tuple.second >> (/=) range) pairs of
                [] ->
                    None

                x ->
                    Explicit x
