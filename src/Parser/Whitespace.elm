module Parser.Whitespace exposing (..)

import Combine exposing (..)


realNewLine : Parser s String
realNewLine =
    or (string "\x0D\n")
        (string "\n")


untilNewlineToken : Parser s String
untilNewlineToken =
    while (\c -> not (c == '\x0D' || c == '\n'))
