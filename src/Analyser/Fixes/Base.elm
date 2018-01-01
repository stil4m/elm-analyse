module Analyser.Fixes.Base exposing (Fixer, Patch(..))

import Analyser.Messages.Data exposing (MessageData)
import Elm.Syntax.File exposing (File)


type alias Fixer =
    { canFix : String
    , fix : ( String, File ) -> MessageData -> Patch
    , description : String
    }


type Patch
    = IncompatibleData
    | Patched String
    | Error String
