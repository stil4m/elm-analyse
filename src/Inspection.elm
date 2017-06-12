module Inspection exposing (run)

import Analyser.FileContext as FileContext
import Analyser.Messages.Types exposing (Message, MessageData(FileLoadFailed, UnformattedFile), newMessage)
import Analyser.Files.Types exposing (LoadedSourceFiles)
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
import Result.Extra
import Analyser.Configuration exposing (Configuration)
import Analyser.CodeBase exposing (CodeBase)


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


run : CodeBase -> LoadedSourceFiles -> Configuration -> List Message
run codeBase includedSources configuration =
    let
        enabledChecks =
            List.filter (\x -> x.shouldCheck configuration) checkers

        ( validSources, invalidSources ) =
            includedSources
                |> List.partition (Tuple.second >> Result.Extra.isOk)

        failedMessages =
            invalidSources
                |> List.filterMap
                    (\( source, result ) ->
                        case result of
                            Err e ->
                                Just ( source, e )

                            Ok _ ->
                                Nothing
                    )
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
            FileContext.build codeBase includedSources
                |> List.concatMap (\x -> List.concatMap (\c -> c.check x configuration) enabledChecks)

        messages =
            List.concat [ failedMessages, fileMessages, inspectionMessages ]
    in
        messages
