module Parser.Infix exposing (..)

import Combine exposing (..)
import Combine.Num exposing (int)
import Parser.Tokens exposing (..)
import Parser.Types exposing (..)
import Parser.Util exposing (moreThanIndentWhitespace)


type InfixDirection
    = Left
    | Right


type alias Infix =
    { direction : InfixDirection, precedence : Int, operator : String }


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
