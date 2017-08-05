module Analyser.Fixes.Base exposing (..)

import Analyser.Messages.Types exposing (MessageData)
import Elm.Syntax.File exposing (..)


type alias Fixer =
    { canFix : MessageData -> Bool
    , fix : List ( String, String, File ) -> MessageData -> Result String (List ( String, String ))
    }
