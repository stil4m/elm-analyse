module Analyser.Messages.Util exposing (..)

import Analyser.Messages.Types exposing (..)
import AST.Ranges exposing (Range, rangeToString)


type alias MessageInfo =
    ( String, GetFiles, List Range )


asString : MessageData -> String
asString m =
    let
        ( f, _, _ ) =
            getMessageInfo m
    in
        f


getFiles : MessageData -> List String
getFiles m =
    let
        ( _, f, _ ) =
            getMessageInfo m
    in
        f m


getRanges : MessageData -> List Range
getRanges m =
    let
        ( _, _, r ) =
            getMessageInfo m
    in
        r


getMessageInfo : MessageData -> MessageInfo
getMessageInfo m =
    case m of
        UnusedTopLevel fileName varName range ->
            ( String.concat
                [ "Unused top level definition `", varName, "` in file \"", fileName, "\" at ", rangeToString range ]
            , (always [ fileName ])
            , [ range ]
            )

        UnusedVariable fileName varName range ->
            ( String.concat
                [ "Unused variable `"
                , varName
                , "` in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]
            , (always [ fileName ])
            , [ range ]
            )

        UnreadableSourceFile fileName ->
            ( String.concat
                [ "Could not parse source file: ", fileName ]
            , (always [ fileName ])
            , []
            )

        UnreadableDependencyFile dependency fileName ->
            ( String.concat
                [ "Could not parse file in dependency"
                , dependency
                , ": "
                , fileName
                ]
            , (always [ fileName ])
            , []
            )

        ExposeAll fileName range ->
            ( String.concat
                [ "Exposing all in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]
            , (always [ fileName ])
            , [ range ]
            )

        ImportAll fileName moduleName range ->
            ( String.concat
                [ "Importing all from module `"
                , String.join "." moduleName
                , "`in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]
            , (always [ fileName ])
            , [ range ]
            )

        NoTopLevelSignature fileName varName range ->
            ( String.concat
                [ "No signature for top level definition `"
                , varName
                , "` in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]
            , (always [ fileName ])
            , [ range ]
            )

        UnnecessaryParens fileName range ->
            ( String.concat
                [ "Unnecessary parens in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]
            , (always [ fileName ])
            , [ range ]
            )

        DebugLog fileName range ->
            ( String.concat
                [ "Use of debug log in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]
            , (always [ fileName ])
            , [ range ]
            )

        DebugCrash fileName range ->
            ( String.concat
                [ "Use of debug crash in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]
            , (always [ fileName ])
            , [ range ]
            )

        UnformattedFile fileName ->
            ( String.concat
                [ "Unformatted file \""
                , fileName
                , "\""
                ]
            , (always [ fileName ])
            , []
            )

        DuplicateImport fileName moduleName ranges ->
            ( String.concat
                [ "Duplicate import for module `"
                , String.join "." moduleName
                , "`in file \""
                , fileName
                , "\" at [ "
                , String.join " | " (List.map rangeToString ranges)
                , " ]"
                ]
            , (always [ fileName ])
            , ranges
            )

        UnusedImportAlias fileName moduleName range ->
            ( String.concat
                [ "Unused import alias `"
                , String.join "." moduleName
                , "`in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]
            , (always [ fileName ])
            , [ range ]
            )

        UnusedImport fileName moduleName range ->
            ( String.concat
                [ "Unused import `"
                , String.join "." moduleName
                , "`in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]
            , (always [ fileName ])
            , [ range ]
            )

        UnusedAlias fileName name range ->
            ( String.concat
                [ "Type alias `"
                , name
                , "` is not used in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]
            , (always [ fileName ])
            , [ range ]
            )

        NoUnurriedPrefix fileName operator range ->
            ( String.concat
                [ "Prefix notation for `"
                , operator
                , "` is unneeded in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]
            , (always [ fileName ])
            , [ range ]
            )

        RedefineVariable fileName name range1 range2 ->
            ( String.concat
                [ "Variable `"
                , name
                , "` is redefined in file \""
                , fileName
                , "\". At "
                , rangeToString range1
                , " and "
                , rangeToString range2
                ]
            , (always [ fileName ])
            , [ range1, range2 ]
            )
