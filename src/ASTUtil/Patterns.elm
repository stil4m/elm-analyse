module ASTUtil.Patterns exposing (patternAsString, findParentPattern)

import AST.Types exposing (File, Pattern(..), Function, Case, VariablePointer, QualifiedNameRef)
import AST.Ranges as Ranges exposing (Range)
import ASTUtil.PatternOptimizer as PatternOptimizer
import Maybe.Extra as Maybe
import Inspector exposing (defaultConfig, Order(Pre))


patternAsString : Pattern -> String
patternAsString pattern =
    case pattern of
        VarPattern x _ ->
            x

        AST.Types.AllPattern _ ->
            "_"

        AST.Types.UnitPattern _ ->
            "()"

        AST.Types.CharPattern c _ ->
            String.fromChar c

        AST.Types.StringPattern s _ ->
            "\"" ++ s ++ "\""

        AST.Types.IntPattern i _ ->
            toString i

        AST.Types.FloatPattern f _ ->
            toString f

        AST.Types.TuplePattern inner _ ->
            inner
                |> List.map patternAsString
                |> String.join ", "
                |> (++) "("
                |> flip (++) ")"

        AST.Types.RecordPattern inner _ ->
            inner
                |> List.map .value
                |> String.join ", "
                |> (++) "{"
                |> flip (++) "}"

        AST.Types.UnConsPattern x xs _ ->
            patternAsString x ++ " :: " ++ patternAsString xs

        AST.Types.ListPattern inner _ ->
            inner
                |> List.map patternAsString
                |> String.join ", "
                |> (++) "["
                |> flip (++) "]"

        AST.Types.NamedPattern qnr inner _ ->
            String.join " " (String.join "." (qnr.moduleName ++ [ qnr.name ]) :: List.map patternAsString inner)

        AST.Types.QualifiedNamePattern qnr _ ->
            String.join "." (qnr.moduleName ++ [ qnr.name ])

        AST.Types.AsPattern inner asName _ ->
            patternAsString inner ++ " as " ++ asName.value

        AST.Types.ParentisizedPattern inner _ ->
            "(" ++ patternAsString inner ++ ")"


findParentPattern : File -> Range -> Maybe Pattern
findParentPattern file range =
    let
        onFunction : Function -> Maybe Pattern -> Maybe Pattern
        onFunction func context =
            context
                |> Maybe.orElseLazy
                    (\() ->
                        func.declaration.arguments
                            |> List.filter (PatternOptimizer.patternRange >> Ranges.containsRange range)
                            |> List.head
                    )

        onCase : Case -> Maybe Pattern -> Maybe Pattern
        onCase c context =
            context
                |> Maybe.orElseLazy
                    (\() ->
                        if Ranges.containsRange range (PatternOptimizer.patternRange (Tuple.first c)) then
                            Just (Tuple.first c)
                        else
                            Nothing
                    )
    in
        Inspector.inspect
            { defaultConfig
              -- TODO Collect all pattern locations. Extract this to another place?
                | onFunction = Pre onFunction
                , onCase = Pre onCase
            }
            file
            Nothing
