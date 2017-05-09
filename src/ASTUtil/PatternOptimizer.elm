module ASTUtil.PatternOptimizer exposing (optimize, patternRange)

import Elm.Syntax.Range exposing (Range)
import Elm.Syntax.Pattern exposing (..)


emptyRange : Range
emptyRange =
    { start = { row = 0, column = 0 }, end = { row = 0, column = 0 } }


replaceWithAllIfRangeMatches : Pattern -> Range -> Range -> Pattern
replaceWithAllIfRangeMatches p x y =
    if x == y then
        AllPattern emptyRange
    else
        p


isAllPattern : Pattern -> Bool
isAllPattern p =
    case p of
        AllPattern _ ->
            True

        _ ->
            False


optimize : Range -> Pattern -> Pattern
optimize range pattern =
    if patternRange pattern == range then
        AllPattern emptyRange
    else
        case pattern of
            TuplePattern xs r ->
                let
                    cleaned =
                        List.map (optimize range) xs
                in
                    if List.all isAllPattern cleaned then
                        AllPattern emptyRange
                    else
                        TuplePattern cleaned r

            RecordPattern inner r ->
                let
                    cleaned =
                        List.filter (.range >> (/=) range) inner
                in
                    case cleaned of
                        [] ->
                            AllPattern emptyRange

                        xs ->
                            RecordPattern xs r

            UnConsPattern left right r ->
                UnConsPattern (optimize range left) (optimize range right) r

            ListPattern xs r ->
                ListPattern (List.map (optimize range) xs) r

            NamedPattern qnr inner r ->
                NamedPattern qnr (List.map (optimize range) inner) r

            QualifiedNamePattern _ r ->
                replaceWithAllIfRangeMatches pattern range r

            AsPattern subPattern asPointer r ->
                if asPointer.range == range then
                    subPattern
                else
                    case optimize range subPattern of
                        AllPattern _ ->
                            VarPattern asPointer.value asPointer.range

                        other ->
                            AsPattern other asPointer r

            ParenthesizedPattern inner r ->
                ParenthesizedPattern (optimize range inner) r

            VarPattern _ _ ->
                pattern

            AllPattern _ ->
                pattern

            UnitPattern _ ->
                pattern

            CharPattern _ _ ->
                pattern

            StringPattern _ _ ->
                pattern

            IntPattern _ _ ->
                pattern

            FloatPattern _ _ ->
                pattern


{-| TODO Should be moved to different file
-}
patternRange : Pattern -> Range
patternRange p =
    case p of
        VarPattern _ r ->
            r

        AllPattern r ->
            r

        UnitPattern r ->
            r

        CharPattern _ r ->
            r

        StringPattern _ r ->
            r

        IntPattern _ r ->
            r

        FloatPattern _ r ->
            r

        TuplePattern _ r ->
            r

        RecordPattern _ r ->
            r

        UnConsPattern _ _ r ->
            r

        ListPattern _ r ->
            r

        NamedPattern _ _ r ->
            r

        QualifiedNamePattern _ r ->
            r

        AsPattern _ _ r ->
            r

        ParenthesizedPattern _ r ->
            r
