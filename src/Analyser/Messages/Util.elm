module Analyser.Messages.Util exposing (..)

import Analyser.Messages.Types exposing (..)
import AST.Ranges exposing (Range, rangeToString)


type alias CanFix =
    Bool


type alias MessageInfo =
    ( String, GetFiles, List Range, CanFix )


blockForShas : List String -> Message -> Message
blockForShas shas message =
    let
        shouldBlock =
            List.any (flip List.member shas) (List.map Tuple.first message.files)
    in
        if shouldBlock then
            { message | status = Blocked }
        else
            message


markFixing : Int -> Message -> Message
markFixing x message =
    if message.id == x then
        { message | status = Fixing }
    else
        message


asString : MessageData -> String
asString m =
    let
        ( f, _, _, _ ) =
            getMessageInfo m
    in
        f


getFiles : MessageData -> List String
getFiles m =
    let
        ( _, f, _, _ ) =
            getMessageInfo m
    in
        f m


getRanges : MessageData -> List Range
getRanges m =
    let
        ( _, _, r, _ ) =
            getMessageInfo m
    in
        r


canFix : MessageData -> Bool
canFix m =
    let
        ( _, _, _, result ) =
            getMessageInfo m
    in
        result


getMessageInfo : MessageData -> MessageInfo
getMessageInfo m =
    case m of
        UnusedTopLevel fileName varName range ->
            ( String.concat
                [ "Unused top level definition `", varName, "` in file \"", fileName, "\" at ", rangeToString range ]
            , always [ fileName ]
            , [ range ]
            , True
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
            , always [ fileName ]
            , [ range ]
            , True
            )

        UnusedImportedVariable fileName varName range ->
            ( String.concat
                [ "Unused imported variable `"
                , varName
                , "` in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]
            , always [ fileName ]
            , [ range ]
            , True
            )

        UnusedPatternVariable fileName varName range ->
            ( String.concat
                [ "Unused variable `"
                , varName
                , "` inside pattern in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]
            , always [ fileName ]
            , [ range ]
            , True
            )

        UnreadableSourceFile fileName ->
            ( String.concat
                [ "Could not parse source file: ", fileName ]
            , always [ fileName ]
            , []
            , True
            )

        ExposeAll fileName range ->
            ( String.concat
                [ "Exposing all in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]
            , always [ fileName ]
            , [ range ]
            , False
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
            , always [ fileName ]
            , [ range ]
            , False
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
            , always [ fileName ]
            , [ range ]
            , False
            )

        UnnecessaryParens fileName range ->
            ( String.concat
                [ "Unnecessary parens in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]
            , always [ fileName ]
            , [ range ]
            , True
            )

        DebugLog fileName range ->
            ( String.concat
                [ "Use of debug log in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]
            , always [ fileName ]
            , [ range ]
            , True
            )

        DebugCrash fileName range ->
            ( String.concat
                [ "Use of debug crash in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]
            , always [ fileName ]
            , [ range ]
            , True
            )

        UnformattedFile fileName ->
            ( String.concat
                [ "Unformatted file \""
                , fileName
                , "\""
                ]
            , always [ fileName ]
            , []
            , True
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
            , always [ fileName ]
            , ranges
            , True
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
            , always [ fileName ]
            , [ range ]
            , True
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
            , always [ fileName ]
            , [ range ]
            , True
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
            , always [ fileName ]
            , [ range ]
            , True
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
            , always [ fileName ]
            , [ range ]
            , False
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
            , always [ fileName ]
            , [ range1, range2 ]
            , False
            )
