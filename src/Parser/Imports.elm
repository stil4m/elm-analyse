module Parser.Imports exposing (..)

import Combine exposing (..)
import Parser.Expose exposing (exposable, exposeDefinition)
import Parser.Tokens exposing (..)
import Parser.Types exposing (..)
import Parser.Util exposing (moreThanIndentWhitespace)


importDefinition : Parser State Import
importDefinition =
    succeed Import
        <*> (importToken *> moreThanIndentWhitespace *> moduleName)
        <*> (maybe (moreThanIndentWhitespace *> asToken *> moreThanIndentWhitespace *> moduleName))
        <*> exposeDefinition exposable
