module Analyser.QuickFixer exposing (fix, fixAll)

import Analyser.CodeBase as CodeBase exposing (CodeBase)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext as FileContext exposing (FileContext)
import Analyser.Files.FileLoader as FileLoader
import Analyser.Fixers as Fixers
import Analyser.Fixes.Base exposing (Patch(..))
import Analyser.Messages.Types exposing (Message)
import Inspection
import Maybe.Extra as Maybe


fix : CodeBase -> Message -> Result String FileContext
fix codeBase message =
    let
        messageId =
            String.fromInt message.id
    in
    case getFileContext message.file.path codeBase of
        Just fileContext ->
            Fixers.getFixer message
                |> Maybe.map
                    (\fixer ->
                        case fixer.fix ( fileContext.content, fileContext.ast ) message.data of
                            Error e ->
                                Err e

                            Patched p ->
                                Ok { fileContext | content = p }

                            IncompatibleData ->
                                Err ("Invalid message data for fixer, message id: " ++ messageId)
                    )
                |> Maybe.withDefault (Err ("Unable to find fixer for messageId: " ++ messageId))

        Nothing ->
            Err ("Unable to find file for message id: " ++ messageId)


fixAll : Configuration -> CodeBase -> List Message -> String -> Result String String
fixAll configuration codeBase messages path =
    case getFileContext path codeBase of
        Just fileContext ->
            Ok (fixAllHelp configuration codeBase messages fileContext).content

        Nothing ->
            Err ("Unable to find file in code base, path: " ++ path)


{-| Recursively fix a file, re-inspecting after each fix
-}
fixAllHelp : Configuration -> CodeBase -> List Message -> FileContext -> FileContext
fixAllHelp configuration codeBase messages fileContext =
    case messages of
        [] ->
            fileContext

        message :: _ ->
            let
                nextFileContext =
                    fix codeBase message
                        |> Result.withDefault fileContext

                loadedSourceFile =
                    Tuple.first <|
                        FileLoader.load
                            { path = nextFileContext.file.path
                            , success = True
                            , sha1 = Nothing
                            , content = Just nextFileContext.content
                            , ast = Nothing
                            }

                nextCodeBase =
                    CodeBase.addSourceFiles [ loadedSourceFile ] codeBase
            in
            fixAllHelp
                configuration
                nextCodeBase
                (Inspection.run nextCodeBase [ loadedSourceFile ] configuration
                    |> List.filter Fixers.canFix
                )
                nextFileContext


getFileContext : String -> CodeBase -> Maybe FileContext
getFileContext path codeBase =
    CodeBase.getFile path codeBase
        |> Maybe.map (FileContext.buildForFile (CodeBase.processContext codeBase))
        |> Maybe.join
