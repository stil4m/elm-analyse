module ASTUtil.Patterns exposing (findParentPattern)

import AST.Ranges as Ranges
import ASTUtil.Inspector as Inspector exposing (Order(Pre), defaultConfig)
import ASTUtil.PatternOptimizer as PatternOptimizer
import Elm.Syntax.Expression exposing (..)
import Elm.Syntax.File exposing (..)
import Elm.Syntax.Pattern exposing (..)
import Elm.Syntax.Range exposing (Range)
import Maybe.Extra as Maybe


findParentPattern : File -> Range -> Maybe Pattern
findParentPattern file range =
    let
        onFunction : Function -> Maybe Pattern -> Maybe Pattern
        onFunction func =
            Maybe.orElseLazy
                (\() ->
                    func.declaration.arguments
                        |> List.filter (PatternOptimizer.patternRange >> Ranges.containsRange range)
                        |> List.head
                )

        onCase : Case -> Maybe Pattern -> Maybe Pattern
        onCase c =
            Maybe.orElseLazy
                (\() ->
                    if Ranges.containsRange range (PatternOptimizer.patternRange (Tuple.first c)) then
                        Just (Tuple.first c)
                    else
                        Nothing
                )

        onLambda : Lambda -> Maybe Pattern -> Maybe Pattern
        onLambda l =
            Maybe.orElseLazy
                (\() ->
                    l.args
                        |> List.filter (PatternOptimizer.patternRange >> Ranges.containsRange range)
                        |> List.head
                )

        onDestructuring : ( Pattern, Expression ) -> Maybe Pattern -> Maybe Pattern
        onDestructuring ( patt, _ ) =
            Maybe.orElseLazy
                (\() ->
                    if PatternOptimizer.patternRange patt |> Ranges.containsRange range then
                        Just patt
                    else
                        Nothing
                )
    in
        Inspector.inspect
            { defaultConfig
              -- TODO Collect all pattern locations. Extract this to another place?
                | onFunction = Pre onFunction
                , onCase = Pre onCase
                , onLambda = Pre onLambda
                , onDestructuring = Pre onDestructuring
            }
            file
            Nothing
