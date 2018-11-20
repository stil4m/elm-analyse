module Inspection exposing (run)

import Analyser.Checks
import Analyser.Checks.Base exposing (Checker)
import Analyser.Checks.FileLoadFailed as FileLoadFailed
import Analyser.CodeBase exposing (CodeBase)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext as FileContext
import Analyser.Files.FileContent as FileContent
import Analyser.Files.Types exposing (LoadedSourceFiles)
import Analyser.Messages.Data as Data
import Analyser.Messages.Types exposing (Message, newMessage)
import Result.Extra


run : CodeBase -> LoadedSourceFiles -> Configuration -> List Message
run codeBase includedSources configuration =
    let
        enabledChecks =
            List.filter (.info >> .key >> (\a -> Analyser.Configuration.checkEnabled a configuration)) Analyser.Checks.all

        failedMessages : List Message
        failedMessages =
            includedSources
                |> List.filter (Tuple.second >> Result.Extra.isOk >> not)
                |> List.filterMap
                    (\( source, result ) ->
                        case result of
                            Err e ->
                                Just ( source, e )

                            Ok _ ->
                                Nothing
                    )
                |> List.map
                    (\( source, _ ) ->
                        newMessage
                            (FileContent.asFileRef source)
                            (FileLoadFailed.checker |> .info |> .key)
                            (Data.init
                                "Could not load file due to: Unexpected parse error"
                                |> Data.addErrorMessage "message" "Unexpected parse error"
                            )
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
    enabledChecks
        |> List.concatMap (\c -> List.map (\b -> ( c, b )) (c.check fileContext configuration))
        |> List.map (\( c, data ) -> newMessage fileContext.file c.info.key data)
