module Analyser.Fixes.Base exposing (Fixer)

import Analyser.Messages.Data exposing (MessageData)
import Elm.Syntax.File exposing (..)


type alias Fixer =
    { canFix : String
    , fix : ( String, File ) -> MessageData -> Result String String
    , description : String
    }
