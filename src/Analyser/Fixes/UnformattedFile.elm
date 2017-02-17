module Analyser.Fixes.UnformattedFile exposing (fixer)

import Analyser.Messages.Types exposing (MessageData(UnformattedFile))
import Analyser.Fixes.Base exposing (Fixer)
import AST.Types exposing (File)
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


fix : List ( String, String, File ) -> MessageData -> List ( String, String )
fix input messageData =
    case messageData of
        UnformattedFile _ ->
            List.map Tuple3.init input

        _ ->
            []
