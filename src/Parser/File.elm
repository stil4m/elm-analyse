module File exposing (..)

import Combine exposing (..)
import Parser.Types exposing (..)


type Declaration
    = TypeDeclartion Type
    | TypeAliasDeclaration TypeAlias
    | FunctionDeclaration


type alias File =
    { moduleDefinition : Module
    , imports : List Import
    , declarations : List Declaration
    }
