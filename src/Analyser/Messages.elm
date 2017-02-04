module Analyser.Messages exposing (Message(..), asString)

import AST.Types as AST
import AST.Ranges exposing (Range, rangeToString)


type Message
    = UnreadableSourceFile FileName
    | UnreadableDependencyFile FileName String
    | UnusedVariable FileName String Range
    | UnusedTopLevel FileName String Range
    | ExposeAll FileName Range
    | ImportAll FileName AST.ModuleName Range
    | NoTopLevelSignature FileName String Range
    | UnnecessaryParens FileName Range
    | DebugLog FileName Range
    | DebugCrash FileName Range
    | UnformattedFile FileName
    | DuplicateImport FileName AST.ModuleName Range
    | UnusedAlias FileName String Range
    | RedefineVariable FileName String Range Range
    | NoUnurriedPrefix FileName String Range


type alias FileName =
    String


asString : Message -> String
asString m =
    case m of
        UnusedTopLevel fileName varName range ->
            String.concat
                [ "Unused top level definition `"
                , varName
                , "` in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]

        UnusedVariable fileName varName range ->
            String.concat
                [ "Unused variable `"
                , varName
                , "` in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]

        UnreadableSourceFile s ->
            String.concat
                [ "Could not parse source file: ", s ]

        UnreadableDependencyFile dependency path ->
            String.concat
                [ "Could not parse file in dependency"
                , dependency
                , ": "
                , path
                ]

        ExposeAll fileName range ->
            String.concat
                [ "Exposing all in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]

        ImportAll fileName moduleName range ->
            String.concat
                [ "Importing all from module `"
                , String.join "." moduleName
                , "`in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]

        NoTopLevelSignature fileName varName range ->
            String.concat
                [ "No signature for top level definition `"
                , varName
                , "` in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]

        UnnecessaryParens fileName range ->
            String.concat
                [ "Unnecessary parens in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]

        DebugLog fileName range ->
            String.concat
                [ "Use of debug log in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]

        DebugCrash fileName range ->
            String.concat
                [ "Use of debug crash in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]

        UnformattedFile fileName ->
            String.concat
                [ "Unformatted file \""
                , fileName
                , "\""
                ]

        DuplicateImport fileName moduleName range ->
            String.concat
                [ "Duplicate import for module `"
                , String.join "." moduleName
                , "`in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]

        UnusedAlias fileName name range ->
            String.concat
                [ "Type alias `"
                , name
                , "` is not used in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]

        NoUnurriedPrefix fileName operator range ->
            String.concat
                [ "Prefix notation for `"
                , operator
                , "` is unneeded in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]

        RedefineVariable fileName name range1 range2 ->
            String.concat
                [ "Variable `"
                , name
                , "` is redefined in file \""
                , fileName
                , "\". At "
                , rangeToString range1
                , " and "
                , rangeToString range2
                ]
