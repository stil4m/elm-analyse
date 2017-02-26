module Parser.Parser exposing (parse)

import Combine exposing ((<*))
import AST.Types exposing (File)
import Parser.State exposing (emptyState)
import Parser.File exposing (file)


parse : String -> Maybe File
parse input =
    -- A single line is added for unfinished ranges produced by `parser-combinators` on the last line.
    case Combine.runParser (file <* Combine.end) emptyState (input ++ "\n") of
        Ok ( _, _, r ) ->
            Just r

        _ ->
            Nothing
