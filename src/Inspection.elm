module Inspection exposing (run)

import Analyser.FileContext as FileContext
import Analyser.Messages.Types exposing (Message, MessageData(FileLoadFailed, UnformattedFile), newMessage)
import Analyser.Files.Types exposing (Dependency, LoadedSourceFiles)
import Analyser.Checks.UnusedVariable as UnusedVariable
import Analyser.Checks.NotExposeAll as NotExposeAll
import Analyser.Checks.NoImportAll as NoImportAll
import Analyser.Checks.NoSignature as NoSignature
import Analyser.Checks.UnnecessaryParens as UnnecessaryParens
import Analyser.Checks.NoDebug as NoDebug
import Analyser.Checks.DuplicateImports as DuplicateImports
import Analyser.Checks.UnusedTypeAliases as UnusedTypeAliases
import Analyser.Checks.OverriddenVariables as OverriddenVariables
import Analyser.Checks.NoUncurriedPrefix as NoUncurriedPrefix
import Analyser.Checks.UnusedImportAliases as UnusedImportAliases
import Analyser.Checks.UnusedImports as UnusedImports
import Analyser.Checks.ListOperators as ListOperators
import Analyser.Util


run : LoadedSourceFiles -> List Dependency -> List Message
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
            , UnusedTypeAliases.scan
            , OverriddenVariables.scan
            , NoUncurriedPrefix.scan
            , UnusedImportAliases.scan
            , UnusedImports.scan
            , ListOperators.scan
            ]

        ( validSources, invalidSources ) =
            List.partition (Tuple.second >> Analyser.Util.isLoaded)
                sources

        failedMessages =
            invalidSources
                |> List.map Tuple.first
                |> List.map
                    (\source ->
                        newMessage
                            [ ( Maybe.withDefault "" source.sha1
                              , source.path
                              )
                            ]
                            (FileLoadFailed source.path)
                    )

        fileMessages =
            validSources
                |> List.map Tuple.first
                |> List.filter (not << .formatted)
                |> List.map
                    (\source ->
                        newMessage
                            [ ( Maybe.withDefault "" source.sha1
                              , source.path
                              )
                            ]
                            (UnformattedFile source.path)
                    )

        inspectionMessages =
            sources
                |> List.filterMap (FileContext.create sources deps)
                |> List.concatMap (\x -> List.concatMap ((|>) x) checks)

        messages =
            List.concat [ failedMessages, fileMessages, inspectionMessages ]
    in
        messages
