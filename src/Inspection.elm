module Inspection exposing (run)

import Analyser.FileContext as FileContext
import Analyser.LoadedDependencies exposing (LoadedDependencies)
import Analyser.Messages exposing (Message(UnformattedFile))
import Analyser.Types exposing (LoadedSourceFiles)
import Analyser.Checks.UnusedVariable as UnusedVariable
import Analyser.Checks.NotExposeAll as NotExposeAll
import Analyser.Checks.NoImportAll as NoImportAll
import Analyser.Checks.NoSignature as NoSignature
import Analyser.Checks.UnnecessaryParens as UnnecessaryParens
import Analyser.Checks.NoDebug as NoDebug
import Analyser.Checks.DuplicateImports as DuplicateImports


run : LoadedSourceFiles -> LoadedDependencies -> List Message
run sources deps =
    let
        checks =
            [ UnusedVariable.scan
            , NotExposeAll.scan
            , NoImportAll.scan
            , NoSignature.scan
            , UnnecessaryParens.scan
            , NoDebug.scan
            , DuplicateImports.scan
            ]

        fileMessages =
            sources
                |> List.map Tuple.first
                |> List.filter (not << .formatted)
                |> List.map (.path >> UnformattedFile)

        inspectionMessages =
            sources
                |> List.filterMap (FileContext.create sources deps)
                |> List.concatMap (\x -> List.concatMap ((|>) x) checks)

        messages =
            List.concat [ inspectionMessages, fileMessages ]
    in
        messages
