module Analyser.Fixes.DuplicateImport exposing (fixer)

import Analyser.Checks.DuplicateImport as DuplicateImportCheck
import Analyser.Fixes.Base exposing (Fixer, Patch(..))
import Analyser.Fixes.FileContent as FileContent
import Analyser.Messages.Data as Data exposing (MessageData)
import Elm.Syntax.File exposing (File)
import Elm.Syntax.Module exposing (Module(..))
import Elm.Syntax.Range exposing (Range)


fixer : Fixer
fixer =
    Fixer (.key <| .info <| DuplicateImportCheck.checker) fix "Remove extra imports and format"


fix : ( String, File ) -> MessageData -> Patch
fix input messageData =
    case
        Data.getRangeList "ranges" messageData
    of
        Just ranges ->
            removeImports input (List.drop 1 ranges)

        Nothing ->
            IncompatibleData


removeImports : ( String, File ) -> List Range -> Patch
removeImports ( content, _ ) ranges =
    ranges
        |> List.sortBy (.start >> .row)
        |> List.reverse
        |> List.foldr (\range -> FileContent.replaceRangeWith range "") content
        |> Patched
