module Parser exposing (..)

import Combine exposing ((<*))
import Parser.Types exposing (emptyState)
import Parser.Declarations exposing (file, File)


parse : String -> Maybe File
parse input =
    case Combine.runParser (file <* Combine.end) emptyState input of
        Ok ( _, _, r ) ->
            Just r

        _ ->
            Nothing
