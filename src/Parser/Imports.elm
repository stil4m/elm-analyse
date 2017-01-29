module Parser.Imports exposing (importDefinition)

import Combine exposing (..)
import Parser.Expose exposing (exposable, exposeDefinition)
import Parser.Tokens exposing (..)
import AST.Types exposing (..)
import Parser.Util exposing (moreThanIndentWhitespace)


importDefinition : Parser State Import
importDefinition =
    succeed Import
        <*> (importToken *> moreThanIndentWhitespace *> moduleName)
        <*> (maybe (moreThanIndentWhitespace *> asToken *> moreThanIndentWhitespace *> moduleName))
        <*> exposeDefinition exposable
