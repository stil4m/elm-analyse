module Analyser.Fixes.DropConsOfItemAndList exposing (fixer)

import Analyser.Checks.DropConsOfItemAndList as DropConsOfItemAndListCheck
import Analyser.Fixes.Base exposing (Fixer, Patch(..))
import Analyser.Fixes.FileContent as FileContent
import Analyser.Messages.Data as Data exposing (MessageData)
import Elm.Syntax.File exposing (File)
import Elm.Syntax.Range exposing (Range)


fixer : Fixer
fixer =
    Fixer (.key <| .info <| DropConsOfItemAndListCheck.checker)
        fix
        "Combine and format"


fix : ( String, File ) -> MessageData -> Patch
fix ( content, _ ) messageData =
    case
        Maybe.map2 (\a b -> ( a, b ))
            (Data.getRange "head" messageData)
            (Data.getRange "tail" messageData)
    of
        Just ( headRange, tailRange ) ->
            Patched (fixContent headRange tailRange content)

        Nothing ->
            IncompatibleData


fixContent : Range -> Range -> String -> String
fixContent headRange tailRange content =
    let
        middleRange =
            { start = headRange.end, end = tailRange.start }
    in
    content
        -- Drop the opening `[`
        |> FileContent.updateRange tailRange (String.dropLeft 1)
        -- Replace the `::`
        |> FileContent.replaceRangeWith middleRange ","
        -- Add new opening `[`
        |> FileContent.updateRange headRange (String.append "[ ")
