module Parser.Whitespace exposing (nSpaces, manySpaces, many1Spaces, realNewLine, untilNewlineToken)

import Combine exposing (count, (<$>), regex, Parser)
import Combine.Char exposing (char)


nSpaces : Int -> Parser s String
nSpaces x =
    String.fromList <$> count x (char ' ')


manySpaces : Parser s String
manySpaces =
    -- String.fromList <$> many (char ' ')
    regex " *"


many1Spaces : Parser s String
many1Spaces =
    -- String.fromList <$> many1 (char ' ')
    regex " +"


realNewLine : Parser s String
realNewLine =
    -- or (string "\x0D\n")
    -- (string "\n")
    regex "\x0D?\n"


untilNewlineToken : Parser s String
untilNewlineToken =
    -- while (\c -> not (c == '\x0D' || c == '\n'))
    regex "[^\x0D\n]*"
