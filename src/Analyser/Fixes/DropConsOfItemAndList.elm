module Analyser.Fixes.DropConsOfItemAndList exposing (fixer)

import Analyser.Checks.DropConsOfItemAndList as DropConsOfItemAndListCheck
import Analyser.Fixes.Base exposing (Fixer)
import Analyser.Fixes.FileContent as FileContent
import Analyser.Messages.Data as Data exposing (MessageData)
import Elm.Syntax.File exposing (File)
import Elm.Syntax.Range exposing (Range)


fixer : Fixer
fixer =
    Fixer (.key <| .info <| DropConsOfItemAndListCheck.checker)
        fix
        "Combine and format"


fix : ( String, File ) -> MessageData -> Result String String
fix ( content, _ ) messageData =
    case
        ( Data.getRange "car" messageData
        , Data.getRange "cdr" messageData
        )
    of
        ( Just carRange, Just cdrRange ) ->
            fixContent carRange cdrRange content |> Ok

        _ ->
            Err "Invalid message data for fixer UnnecessaryParens"


fixContent : Range -> Range -> String -> String
fixContent carRange cdrRange content =
    let
        middleRange =
            { start = carRange.end, end = cdrRange.start }
    in
    content
        -- Drop the opening `[`
        |> FileContent.updateRange cdrRange (String.dropLeft 1)
        -- Replace the `::`
        |> FileContent.replaceRangeWith middleRange ","
        -- Add new opening `[`
        |> FileContent.updateRange carRange (String.append "[ ")
