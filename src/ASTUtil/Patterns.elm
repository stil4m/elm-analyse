module ASTUtil.Patterns exposing (findParentPattern)

import AST.Types exposing (File, Pattern(..), Function, Case, VariablePointer, QualifiedNameRef, Lambda)
import AST.Ranges as Ranges exposing (Range)
import ASTUtil.PatternOptimizer as PatternOptimizer
import Maybe.Extra as Maybe
import ASTUtil.Inspector as Inspector exposing (defaultConfig, Order(Pre))


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
    in
        Inspector.inspect
            { defaultConfig
              -- TODO Collect all pattern locations. Extract this to another place?
                | onFunction = Pre onFunction
                , onCase = Pre onCase
                , onLambda = Pre onLambda
            }
            file
            Nothing
