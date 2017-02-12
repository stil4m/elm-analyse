module Parser.Infix exposing (infixDefinition)

import AST.Types exposing (Infix, InfixDirection(Right, Left))
import Combine exposing ((*>), (<$), (<*>), Parser, choice, or, string, succeed)
import Combine.Num exposing (int)
import Parser.Tokens exposing (prefixOperatorToken)
import Parser.Util exposing (moreThanIndentWhitespace)
import Parser.State exposing (State)


infixDefinition : Parser State Infix
infixDefinition =
    succeed Infix
        <*> infixDirection
        <*> (moreThanIndentWhitespace *> int)
        <*> (moreThanIndentWhitespace *> prefixOperatorToken)


infixDirection : Parser State InfixDirection
infixDirection =
    choice
        [ Right <$ string "infixr"
        , Left <$ or (string "infixl") (string "infix")
        ]
