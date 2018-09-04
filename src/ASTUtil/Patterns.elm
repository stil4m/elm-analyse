module ASTUtil.Patterns exposing (findParentPattern)

import AST.Ranges as Ranges
import ASTUtil.Inspector as Inspector exposing (Order(..), defaultConfig)
import Elm.Syntax.Expression exposing (Case, Expression(..), Function, Lambda)
import Elm.Syntax.File exposing (File)
import Elm.Syntax.Node as Node exposing (Node(..))
import Elm.Syntax.Pattern exposing (Pattern(..))
import Elm.Syntax.Range exposing (Range)
import Maybe.Extra as Maybe


findParentPattern : File -> Range -> Maybe (Node Pattern)
findParentPattern file range =
    let
        onFunction : Node Function -> Maybe (Node Pattern) -> Maybe (Node Pattern)
        onFunction (Node _ func) =
            Maybe.orElseLazy
                (\() ->
                    func.declaration
                        |> Node.value
                        |> .arguments
                        |> List.filter (Node.range >> Ranges.containsRange range)
                        |> List.head
                )

        onCase : Case -> Maybe (Node Pattern) -> Maybe (Node Pattern)
        onCase c =
            Maybe.orElseLazy
                (\() ->
                    if Ranges.containsRange range (Node.range <| Tuple.first c) then
                        Just (Tuple.first c)

                    else
                        Nothing
                )

        onLambda : Lambda -> Maybe (Node Pattern) -> Maybe (Node Pattern)
        onLambda l =
            Maybe.orElseLazy
                (\() ->
                    l.args
                        |> List.filter (Node.range >> Ranges.containsRange range)
                        |> List.head
                )

        onDestructuring : ( Node Pattern, Node Expression ) -> Maybe (Node Pattern) -> Maybe (Node Pattern)
        onDestructuring ( patt, _ ) =
            Maybe.orElseLazy
                (\() ->
                    if Node.range patt |> Ranges.containsRange range then
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
