module Parser.Parser exposing (parse)

import Combine exposing ((<*))
import AST.Types exposing (emptyState, File)
import Parser.Declarations exposing (file)


parse : String -> Maybe File
parse input =
    case Combine.runParser (file <* Combine.end) emptyState input of
        Ok ( _, _, r ) ->
            Just r

        _ ->
            Nothing
