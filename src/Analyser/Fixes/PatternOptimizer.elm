module Analyser.Fixes.PatternOptimizer exposing (optimize)

import AST.Types exposing (Pattern(..))
import AST.Ranges exposing (Range)


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
                let
                    cleaned =
                        List.map (optimize range) xs
                in
                    if List.all isAllPattern cleaned then
                        AllPattern emptyRange
                    else
                        ListPattern cleaned r

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

            ParentisizedPattern inner r ->
                ParentisizedPattern (optimize range inner) r

            VarPattern _ r ->
                pattern

            AllPattern _ ->
                pattern

            UnitPattern r ->
                pattern

            CharPattern _ r ->
                pattern

            StringPattern _ r ->
                pattern

            IntPattern _ r ->
                pattern

            FloatPattern _ r ->
                pattern


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

        ParentisizedPattern _ r ->
            r
