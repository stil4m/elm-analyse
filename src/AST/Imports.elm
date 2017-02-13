module AST.Imports exposing (naiveStringifyImport, removeRangeFromImport)

import AST.Types
    exposing
        ( Import
        , Exposure(None, All, Explicit)
        , ValueConstructorExpose
        , Expose(InfixExpose, FunctionExpose, TypeOrAliasExpose, TypeExpose)
        , ExposedType
        )
import AST.Ranges exposing (Range)


naiveStringifyImport : Import -> String
naiveStringifyImport imp =
    String.concat <|
        [ "import "
        , String.join "." imp.moduleName
        , Maybe.withDefault "" <| Maybe.map (String.join "." >> (++) " as ") imp.moduleAlias
        , stringifyExposingList imp.exposingList
        ]


stringifyExposingList : Exposure Expose -> String
stringifyExposingList exp =
    case exp of
        None ->
            ""

        All _ ->
            " exposing (..)"

        Explicit explicits ->
            " exposing "
                ++ case explicits of
                    [] ->
                        ""

                    x ->
                        let
                            --TODO
                            areOnDifferentLines =
                                False

                            seperator =
                                if areOnDifferentLines then
                                    "\n    , "
                                else
                                    ", "
                        in
                            "(" ++ (List.map stringifyExpose explicits |> String.join seperator) ++ ")"


stringifyExpose : Expose -> String
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
        ++ case constructors of
            None ->
                ""

            All _ ->
                "(..)"

            Explicit explicits ->
                case explicits of
                    [] ->
                        ""

                    x ->
                        let
                            --TODO
                            areOnDifferentLines =
                                False

                            seperator =
                                if areOnDifferentLines then
                                    "\n    , "
                                else
                                    ", "
                        in
                            "(" ++ (String.join seperator <| List.map Tuple.first explicits) ++ ")"


removeRangeFromImport : Range -> Import -> Import
removeRangeFromImport range imp =
    { imp | exposingList = removeRangeFromExposingList range imp.exposingList }


removeRangeFromExposingList : Range -> Exposure Expose -> Exposure Expose
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


removeRangeFromExpose : Range -> Expose -> Maybe Expose
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


removeRangeFromConstructors : Range -> Exposure ValueConstructorExpose -> Exposure ValueConstructorExpose
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
