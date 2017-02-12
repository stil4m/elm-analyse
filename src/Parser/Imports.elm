module Parser.Imports exposing (importDefinition)

import Combine exposing (Parser, succeed, (<*>), (*>), maybe)
import Parser.Expose exposing (exposable, exposeDefinition)
import Parser.Tokens exposing (importToken, moduleName, asToken)
import AST.Types exposing (Import)
import Parser.Util exposing (moreThanIndentWhitespace, withRange)
import Parser.State exposing (State)


importDefinition : Parser State Import
importDefinition =
    withRange <|
        succeed Import
            <*> (importToken *> moreThanIndentWhitespace *> moduleName)
            <*> maybe (moreThanIndentWhitespace *> asToken *> moreThanIndentWhitespace *> moduleName)
            <*> exposeDefinition exposable
