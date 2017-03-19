module Parser.Whitespace exposing (nSpaces, manySpaces, many1Spaces, realNewLine, untilNewlineToken)

import Combine exposing (regex, Parser)


nSpaces : Int -> Parser s String
nSpaces x =
    regex (" {" ++ toString x ++ "}")


manySpaces : Parser s String
manySpaces =
    regex " *"


many1Spaces : Parser s String
many1Spaces =
    regex " +"


realNewLine : Parser s String
realNewLine =
    regex "\x0D?\n"


untilNewlineToken : Parser s String
untilNewlineToken =
    regex "[^\x0D\n]*"
