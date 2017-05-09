module Analyser.Fixes.Base exposing (..)

import Elm.Syntax.File exposing (..)
import Analyser.Messages.Types exposing (MessageData)


type alias Fixer =
    { canFix : MessageData -> Bool
    , fix : List ( String, String, File ) -> MessageData -> Result String (List ( String, String ))
    }
