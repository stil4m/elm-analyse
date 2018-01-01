module Analyser.Fixes.UnformattedFile exposing (fixer)

import Analyser.Checks.UnformattedFile as UnformattedFileCheck
import Analyser.Fixes.Base exposing (Fixer, Patch(..))
import Analyser.Messages.Data exposing (MessageData)
import Elm.Syntax.File exposing (File)


fixer : Fixer
fixer =
    Fixer (.key <| .info <| UnformattedFileCheck.checker) fix "Format"


fix : ( String, File ) -> MessageData -> Patch
fix input _ =
    Patched (Tuple.first input)
