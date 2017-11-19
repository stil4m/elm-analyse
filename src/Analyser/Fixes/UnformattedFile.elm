module Analyser.Fixes.UnformattedFile exposing (fixer)

import Analyser.Checks.UnformattedFile as UnformattedFileCheck
import Analyser.Fixes.Base exposing (Fixer)
import Analyser.Messages.Data exposing (MessageData)
import Elm.Syntax.File exposing (File)


fixer : Fixer
fixer =
    Fixer (.key <| .info <| UnformattedFileCheck.checker) fix "Format"


fix : ( String, File ) -> MessageData -> Result String String
fix input _ =
    Ok (Tuple.first input)
