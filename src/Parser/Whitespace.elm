module Parser.Whitespace exposing (..)

import Combine exposing (..)
import Combine.Char exposing (char)


nSpaces : Int -> Parser s String
nSpaces x =
    String.fromList <$> count x (char ' ')


manySpaces : Parser s String
manySpaces =
    String.fromList <$> many (char ' ')


many1Spaces : Parser s String
many1Spaces =
    String.fromList <$> many1 (char ' ')


realNewLine : Parser s String
realNewLine =
    or (string "\x0D\n")
        (string "\n")


untilNewlineToken : Parser s String
untilNewlineToken =
    while (\c -> not (c == '\x0D' || c == '\n'))
