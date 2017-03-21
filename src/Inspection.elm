module Inspection exposing (run)

import Analyser.FileContext as FileContext
import Analyser.Messages.Types exposing (Message, MessageData(FileLoadFailed, UnformattedFile), newMessage)
import Analyser.Files.Types exposing (Dependency, LoadedSourceFiles)
import Analyser.Checks.UnusedVariable as UnusedVariable
import Analyser.Checks.ExposeAll as ExposeAll
import Analyser.Checks.ImportAll as ImportAll
import Analyser.Checks.NoTopLevelSignature as NoTopLevelSignature
import Analyser.Checks.UnnecessaryParens as UnnecessaryParens
import Analyser.Checks.NoDebug as NoDebug
import Analyser.Checks.DuplicateImport as DuplicateImport
import Analyser.Checks.UnusedTypeAlias as UnusedTypeAlias
import Analyser.Checks.OverriddenVariables as OverriddenVariables
import Analyser.Checks.NoUncurriedPrefix as NoUncurriedPrefix
import Analyser.Checks.UnusedImportAliases as UnusedImportAliases
import Analyser.Checks.UnusedImport as UnusedImport
import Analyser.Checks.ListOperators as ListOperators
import Analyser.Checks.LineLength as LineLength
import Analyser.Checks.UnnecessaryListConcat as UnnecessaryListConcat
import Analyser.Checks.MultiLineRecordFormatting as MultiLineRecordFormatting
import Analyser.Checks.UnnecessaryPortModule as UnnecessaryPortModule
import Analyser.Checks.NonStaticRegex as NonStaticRegex
import Analyser.Checks.CoreArrayUsage as CoreArrayUsage
import Analyser.Checks.FunctionsInLet as FunctionsInLet
import Analyser.Checks.Base exposing (Checker)
import Analyser.Util
import Analyser.Configuration as Configuration exposing (Configuration)


checkers : List Checker
checkers =
    [ UnusedVariable.checker
    , ExposeAll.checker
    , ImportAll.checker
    , NoTopLevelSignature.checker
    , UnnecessaryParens.checker
    , NoDebug.checker
    , DuplicateImport.checker
    , UnusedTypeAlias.checker
    , OverriddenVariables.checker
    , NoUncurriedPrefix.checker
    , UnusedImportAliases.checker
    , UnusedImport.checker
    , ListOperators.checker
    , LineLength.checker
    , UnnecessaryListConcat.checker
    , MultiLineRecordFormatting.checker
    , UnnecessaryPortModule.checker
    , NonStaticRegex.checker
    , CoreArrayUsage.checker
    , FunctionsInLet.checker
    ]


run : LoadedSourceFiles -> List Dependency -> Configuration -> List Message
run sources deps configuration =
    let
        enabledChecks =
            List.filter (\x -> x.shouldCheck configuration) checkers

        includedSources =
            List.filter
                (Tuple.first
                    >> .path
                    >> flip Configuration.isPathExcluded configuration
                    >> not
                )
                sources

        ( validSources, invalidSources ) =
            includedSources
                |> List.partition (Tuple.second >> Analyser.Util.isLoaded)

        failedMessages =
            invalidSources
                |> List.filterMap (\( source, result ) -> Maybe.map ((,) source) (Analyser.Util.fileLoadError result))
                |> List.map
                    (\( source, error ) ->
                        newMessage
                            [ ( Maybe.withDefault "" source.sha1
                              , source.path
                              )
                            ]
                            (FileLoadFailed source.path error)
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
            includedSources
                |> List.filterMap (FileContext.create sources deps)
                |> List.concatMap (\x -> List.concatMap (\c -> c.check x configuration) enabledChecks)

        messages =
            List.concat [ failedMessages, fileMessages, inspectionMessages ]
    in
        messages
