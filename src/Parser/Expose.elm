module Parser.Expose exposing (exposeDefinition, infixExpose, typeExpose, exposingListInner, definitionExpose, exposable)

-- TODO Expose for tests

import Combine exposing (..)
import Combine.Char exposing (..)
import Parser.Tokens exposing (..)
import AST.Types exposing (..)
import Parser.Util exposing (moreThanIndentWhitespace, trimmed, withRange)


exposeDefinition : Parser State a -> Parser State (Exposure a)
exposeDefinition p =
    choice
        [ moreThanIndentWhitespace *> exposingToken *> maybe moreThanIndentWhitespace *> exposeListWith p
        , succeed None
        ]


exposable : Parser State Expose
exposable =
    choice
        [ typeExpose
        , infixExpose
        , definitionExpose
        ]


infixExpose : Parser State Expose
infixExpose =
    InfixExpose <$> parens (while ((/=) ')'))


typeExpose : Parser State Expose
typeExpose =
    succeed TypeExpose
        <*> typeName
        <*> (maybe moreThanIndentWhitespace *> exposeListWith typeName)


exposingListInner : Parser State b -> Parser State (Exposure b)
exposingListInner p =
    or (withRange (All <$ (trimmed (string ".."))))
        (Explicit <$> sepBy (char ',') (trimmed p))


exposeListWith : Parser State b -> Parser State (Exposure b)
exposeListWith p =
    parens (exposingListInner p)


definitionExpose : Parser State Expose
definitionExpose =
    DefinitionExpose <$> functionOrTypeName
