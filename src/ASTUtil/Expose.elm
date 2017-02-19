module ASTUtil.Expose exposing (range)

import AST.Types exposing (Expose(..))
import AST.Ranges exposing (Range)


range : Expose -> Range
range e =
    case e of
        InfixExpose _ r ->
            r

        FunctionExpose _ r ->
            r

        TypeOrAliasExpose _ r ->
            r

        TypeExpose typeExpose ->
            typeExpose.range
