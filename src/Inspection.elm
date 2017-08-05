module Inspection exposing (run)

import Analyser.Checks.Base exposing (Checker)
import Analyser.Checks.CoreArrayUsage as CoreArrayUsage
import Analyser.Checks.DuplicateImport as DuplicateImport
import Analyser.Checks.DuplicateImportedVariable as DuplicateImportedVariable
import Analyser.Checks.DuplicateRecordFieldUpdate as DuplicateRecordFieldUpdate
import Analyser.Checks.ExposeAll as ExposeAll
import Analyser.Checks.FunctionInLet as FunctionInLet
import Analyser.Checks.ImportAll as ImportAll
import Analyser.Checks.LineLength as LineLength
import Analyser.Checks.ListOperators as ListOperators
import Analyser.Checks.MultiLineRecordFormatting as MultiLineRecordFormatting
import Analyser.Checks.NoDebug as NoDebug
import Analyser.Checks.NoTopLevelSignature as NoTopLevelSignature
import Analyser.Checks.NoUncurriedPrefix as NoUncurriedPrefix
import Analyser.Checks.NonStaticRegex as NonStaticRegex
import Analyser.Checks.OverriddenVariables as OverriddenVariables
import Analyser.Checks.SingleFieldRecord as SingleFieldRecord
import Analyser.Checks.TriggerWords as TriggerWords
import Analyser.Checks.UnformattedFile as UnformattedFile
import Analyser.Checks.UnnecessaryListConcat as UnnecessaryListConcat
import Analyser.Checks.UnnecessaryParens as UnnecessaryParens
import Analyser.Checks.UnnecessaryPortModule as UnnecessaryPortModule
import Analyser.Checks.UnusedImport as UnusedImport
import Analyser.Checks.UnusedImportAliases as UnusedImportAliases
import Analyser.Checks.UnusedTypeAlias as UnusedTypeAlias
import Analyser.Checks.UnusedVariable as UnusedVariable
import Analyser.CodeBase exposing (CodeBase)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext as FileContext
import Analyser.Files.Types exposing (LoadedSourceFiles)
import Analyser.Messages.Range as Range
import Analyser.Messages.Types exposing (Message, MessageData(..), newMessage)
import Result.Extra


checkers : List Checker
checkers =
    [ UnusedVariable.checker
    , ExposeAll.checker
    , ImportAll.checker
    , NoTopLevelSignature.checker
    , UnnecessaryParens.checker
    , NoDebug.checker
    , DuplicateImport.checker
    , DuplicateImportedVariable.checker
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
    , FunctionInLet.checker
    , UnformattedFile.checker
    , DuplicateRecordFieldUpdate.checker
    , SingleFieldRecord.checker
    , TriggerWords.checker
    ]


run : CodeBase -> LoadedSourceFiles -> Configuration -> List Message
run codeBase includedSources configuration =
    let
        enabledChecks =
            List.filter (\x -> x.shouldCheck configuration) checkers

        failedMessages =
            includedSources
                |> List.filter (Tuple.second >> Result.Extra.isOk)
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

        inspectionMessages =
            FileContext.build codeBase includedSources
                |> List.concatMap (inspectFileContext configuration enabledChecks)

        messages =
            List.concat [ failedMessages, inspectionMessages ]
    in
    messages


inspectFileContext : Configuration -> List Checker -> FileContext.FileContext -> List Message
inspectFileContext configuration enabledChecks fileContext =
    let
        rangeContext =
            Range.context fileContext.content
    in
    List.concatMap (\c -> c.check rangeContext fileContext configuration) enabledChecks
