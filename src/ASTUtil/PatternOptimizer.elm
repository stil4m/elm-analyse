module ASTUtil.PatternOptimizer exposing (optimize)

import Elm.Syntax.Pattern exposing (Pattern(..))
import Elm.Syntax.Range exposing (Range)
import Elm.Syntax.Ranged exposing (Ranged)


emptyRange : Range
emptyRange =
    { start = { row = 0, column = 0 }, end = { row = 0, column = 0 } }


replaceWithAllIfRangeMatches : Ranged Pattern -> Range -> Range -> Ranged Pattern
replaceWithAllIfRangeMatches ( some, p ) x y =
    if x == y then
        ( emptyRange, AllPattern )
    else
        ( some, p )


isAllPattern : Ranged Pattern -> Bool
isAllPattern p =
    case Tuple.second p of
        AllPattern ->
            True

        _ ->
            False


optimize : Range -> Ranged Pattern -> Ranged Pattern
optimize range (( r, pattern ) as input) =
    if r == range then
        ( emptyRange, AllPattern )
    else
        case pattern of
            TuplePattern xs ->
                let
                    cleaned =
                        List.map (optimize range) xs
                in
                if List.all isAllPattern cleaned then
                    ( emptyRange, AllPattern )
                else
                    ( r, TuplePattern cleaned )

            RecordPattern inner ->
                let
                    cleaned =
                        List.filter (.range >> (/=) range) inner
                in
                case cleaned of
                    [] ->
                        ( emptyRange, AllPattern )

                    xs ->
                        ( r, RecordPattern xs )

            UnConsPattern left right ->
                ( r, UnConsPattern (optimize range left) (optimize range right) )

            ListPattern xs ->
                ( r, ListPattern (List.map (optimize range) xs) )

            NamedPattern qnr inner ->
                ( r, NamedPattern qnr (List.map (optimize range) inner) )

            QualifiedNamePattern _ ->
                replaceWithAllIfRangeMatches input range r

            AsPattern subPattern asPointer ->
                if asPointer.range == range then
                    subPattern
                else
                    case optimize range subPattern of
                        ( _, AllPattern ) ->
                            ( asPointer.range, VarPattern asPointer.value )

                        other ->
                            ( r, AsPattern other asPointer )

            ParenthesizedPattern inner ->
                ( r, ParenthesizedPattern (optimize range inner) )

            VarPattern _ ->
                input

            AllPattern ->
                input

            UnitPattern ->
                input

            CharPattern _ ->
                input

            StringPattern _ ->
                input

            IntPattern _ ->
                input

            FloatPattern _ ->
                input
