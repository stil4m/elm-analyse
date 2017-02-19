module ASTUtil.Expose exposing (range)

import AST.Types exposing (Expose(..))
import AST.Ranges exposing (Range)


range : Expose -> Range
range e =
    case e of
        InfixExpose _ range ->
            range

        FunctionExpose _ range ->
            range

        TypeOrAliasExpose _ range ->
            range

        TypeExpose { range } ->
            range
