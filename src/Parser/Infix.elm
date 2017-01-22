module Parser.Infix exposing (..)

import Combine exposing (..)
import Combine.Num exposing (int)
import Parser.Tokens exposing (..)
import Parser.Types exposing (..)
import Parser.Util exposing (moreThanIndentWhitespace)


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
        , Left <$ string "infixl"
        ]
