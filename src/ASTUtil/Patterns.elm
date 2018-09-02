module ASTUtil.Patterns exposing (findParentPattern)

import AST.Ranges as Ranges
import ASTUtil.Inspector as Inspector exposing (Order(..), defaultConfig)
import Elm.Syntax.Expression exposing (Case, Expression(..), Function, Lambda)
import Elm.Syntax.File exposing (File)
import Elm.Syntax.Pattern exposing (Pattern(..))
import Elm.Syntax.Range exposing (Range)
import Elm.Syntax.Ranged exposing (Ranged)
import Maybe.Extra as Maybe


findParentPattern : File -> Range -> Maybe (Ranged Pattern)
findParentPattern file range =
    let
        onFunction : Function -> Maybe (Ranged Pattern) -> Maybe (Ranged Pattern)
        onFunction func =
            Maybe.orElseLazy
                (\() ->
                    func.declaration.arguments
                        |> List.filter (Tuple.first >> Ranges.containsRange range)
                        |> List.head
                )

        onCase : Case -> Maybe (Ranged Pattern) -> Maybe (Ranged Pattern)
        onCase c =
            Maybe.orElseLazy
                (\() ->
                    if Ranges.containsRange range (Tuple.first (Tuple.first c)) then
                        Just (Tuple.first c)

                    else
                        Nothing
                )

        onLambda : Lambda -> Maybe (Ranged Pattern) -> Maybe (Ranged Pattern)
        onLambda l =
            Maybe.orElseLazy
                (\() ->
                    l.args
                        |> List.filter (Tuple.first >> Ranges.containsRange range)
                        |> List.head
                )

        onDestructuring : ( Ranged Pattern, Ranged Expression ) -> Maybe (Ranged Pattern) -> Maybe (Ranged Pattern)
        onDestructuring ( patt, _ ) =
            Maybe.orElseLazy
                (\() ->
                    if Tuple.first patt |> Ranges.containsRange range then
                        Just patt

                    else
                        Nothing
                )
    in
    Inspector.inspect
        { defaultConfig
            | onFunction = Pre onFunction
            , onCase = Pre onCase
            , onLambda = Pre onLambda
            , onDestructuring = Pre onDestructuring
        }
        file
        Nothing
