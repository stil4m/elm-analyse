module Analyser.Fixes.UnformattedFile exposing (fixer)

import Analyser.Messages.Types exposing (MessageData(UnformattedFile))
import Analyser.Fixes.Base exposing (Fixer)
import Elm.Syntax.File exposing (File)
import Tuple3


fixer : Fixer
fixer =
    Fixer canFix fix


canFix : MessageData -> Bool
canFix message =
    case message of
        UnformattedFile _ ->
            True

        _ ->
            False


fix : List ( String, String, File ) -> MessageData -> Result String (List ( String, String ))
fix input messageData =
    case messageData of
        UnformattedFile _ ->
            Ok (List.map Tuple3.init input)

        _ ->
            Err "Invalid message data for fixer UnformattedFile"
