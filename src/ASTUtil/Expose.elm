module ASTUtil.Expose exposing (range, exposesFunction)

import AST.Types exposing (Exposure(..), Expose(..))
import AST.Ranges exposing (Range)


exposesFunction : String -> Exposure Expose -> Bool
exposesFunction s exposure =
    case exposure of
        All _ ->
            True

        None ->
            False

        Explicit l ->
            List.any
                (\x ->
                    case x of
                        FunctionExpose fun _ ->
                            fun == s

                        _ ->
                            False
                )
                l


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
