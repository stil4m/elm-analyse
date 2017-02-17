module Analyser.Fixes.Base exposing (..)

import AST.Types exposing (File)
import Analyser.Messages.Types exposing (MessageData)


type alias Fixer =
    { canFix : MessageData -> Bool
    , fix : List ( String, String, File ) -> MessageData -> List ( String, String )
    }
