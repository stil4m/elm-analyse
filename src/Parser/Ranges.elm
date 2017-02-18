module Parser.Ranges exposing (..)

import Combine exposing (Parser, ParseLocation, withLocation, succeed, (>>=))
import Parser.State exposing (State)
import AST.Ranges exposing (Range, Location)


asPointerLocation : ParseLocation -> Location
asPointerLocation { line, column } =
    { row = line, column = column }


withRange : Parser State (Range -> a) -> Parser State a
withRange p =
    withLocation
        (\start ->
            p
                >>= \pResult ->
                        withLocation
                            (\end ->
                                succeed <|
                                    pResult
                                        { start = asPointerLocation start
                                        , end = asPointerLocation end
                                        }
                            )
        )
