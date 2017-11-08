module Analyser.Messages.Util exposing (..)

import Analyser.Messages.Range as Ranges exposing (Range, emptyRange, rangeToString, startLine)
import Analyser.Messages.Types exposing (..)


type alias CanFix =
    Bool


type alias MessageInfo =
    ( String, List Range, CanFix )


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
        ( f, _, _ ) =
            getMessageInfo m
    in
    f


messageFile : Message -> String
messageFile m =
    m.files |> List.head |> Maybe.map Tuple.second |> Maybe.withDefault ""


messageFiles : Message -> List String
messageFiles =
    .files >> List.map Tuple.second


firstRange : Message -> Range
firstRange a =
    getRanges a.data |> List.head |> Maybe.withDefault emptyRange


compareMessageLocation : Message -> Message -> Order
compareMessageLocation a b =
    Ranges.orderByStart (firstRange a) (firstRange b)


compareMessageFile : Message -> Message -> Order
compareMessageFile a b =
    compare (messageFile a) (messageFile b)


compareMessage : Message -> Message -> Order
compareMessage a b =
    let
        aFile =
            messageFile a

        bFile =
            messageFile b
    in
    if aFile == bFile then
        Ranges.compareRangeStarts
            (getRanges a.data |> List.head |> Maybe.withDefault Ranges.emptyRange)
            (getRanges b.data |> List.head |> Maybe.withDefault Ranges.emptyRange)
    else
        compare aFile bFile


getRanges : MessageData -> List Range
getRanges m =
    let
        ( _, r, _ ) =
            getMessageInfo m
    in
    r


canFix : MessageData -> Bool
canFix m =
    let
        ( _, _, result ) =
            getMessageInfo m
    in
    result


getMessageInfo : MessageData -> MessageInfo
getMessageInfo m =
    case m of
        UnusedTopLevel fileName varName range ->
            ( String.concat
                [ "Unused top level definition `", varName, "` in file \"", fileName, "\" at ", rangeToString range ]
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
            , [ range ]
            , True
            )

        UnnecessaryPortModule fileName ->
            ( String.concat
                [ "File  `"
                , fileName
                , "` is defined as a `port` module, but is does not declare ports. It may be better to remove these."
                ]
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
            , [ range ]
            , False
            )

        ImportAll fileName moduleName range ->
            ( String.concat
                [ "Importing all from module `"
                , String.join "." moduleName
                , "` in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]
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
            , [ range ]
            , True
            )

        TriggerWord fileName triggerWord range ->
            ( String.concat
                [ "`" ++ triggerWord ++ "` should not be used in comments. Found in \""
                , fileName
                , "\" at "
                , rangeToString range
                ]
            , [ range ]
            , False
            )

        NonStaticRegex fileName range ->
            ( String.concat
                [ "Use of `Regex.regex` as non-static in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]
            , [ range ]
            , False
            )

        CoreArrayUsage fileName range ->
            ( String.concat
                [ "Use of `Array` is disadviced. In \""
                , fileName
                , "\" at "
                , rangeToString range
                ]
            , [ range ]
            , False
            )

        DebugLog fileName range ->
            ( String.concat
                [ "Use of Debug.log in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]
            , [ range ]
            , True
            )

        DebugCrash fileName range ->
            ( String.concat
                [ "Use of Debug.crash in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]
            , [ range ]
            , True
            )

        UnformattedFile fileName ->
            ( String.concat
                [ "Unformatted file \""
                , fileName
                , "\""
                ]
            , []
            , True
            )

        FileLoadFailed fileName message ->
            ( String.concat
                [ "Could not load file \""
                , fileName
                , "\" due to: "
                , message
                ]
            , []
            , True
            )

        DuplicateImport fileName moduleName ranges ->
            ( String.concat
                [ "Duplicate import for module `"
                , String.join "." moduleName
                , "` in file \""
                , fileName
                , "\" at [ "
                , String.join " | " (List.map rangeToString ranges)
                , " ]"
                ]
            , ranges
            , True
            )

        DuplicateImportedVariable fileName moduleName name ranges ->
            ( String.concat
                [ "Variable `"
                , name
                , "` imported multiple times module `"
                , String.join "." moduleName
                , "` in file \""
                , fileName
                , "\" at [ "
                , String.join " | " (List.map rangeToString ranges)
                , " ]"
                ]
            , ranges
            , True
            )

        UnusedImportAlias fileName moduleName range ->
            ( String.concat
                [ "Unused import alias `"
                , String.join "." moduleName
                , "` in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]
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
            , [ range ]
            , True
            )

        UnusedTypeAlias fileName name range ->
            ( String.concat
                [ "Type alias `"
                , name
                , "` is not used in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]
            , [ range ]
            , True
            )

        MultiLineRecordFormatting fileName range ->
            ( String.concat
                [ "Record should be formatted over multiple lines in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]
            , [ range ]
            , True
            )

        NoUncurriedPrefix fileName operator range ->
            ( String.concat
                [ "Prefix notation for `"
                , operator
                , "` is unneeded in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]
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
            , [ range1, range2 ]
            , False
            )

        UseConsOverConcat fileName range ->
            ( String.concat
                [ "Use `::` instead of `++` in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]
            , [ range ]
            , True
            )

        DropConcatOfLists fileName range ->
            ( String.concat
                [ "Joining two literal lists with `++`, but instead you can just join the lists. \""
                , fileName
                , "\" at "
                , rangeToString range
                ]
            , [ range ]
            , True
            )

        DropConsOfItemAndList fileName range ->
            ( String.concat
                [ "Adding an item to the front of a literal list, but instead you can just put it in the list. \""
                , fileName
                , "\" at "
                , rangeToString range
                ]
            , [ range ]
            , True
            )

        LineLengthExceeded fileName ranges ->
            ( String.concat
                [ "Line length exceeded on line(s) "
                , toString (List.map startLine ranges)
                , " in file \""
                , fileName
                , "\"."
                ]
            , ranges
            , False
            )

        UnnecessaryListConcat fileName range ->
            ( String.concat
                [ "Better merge the arguments of `List.concat` to a single list in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]
            , [ range ]
            , True
            )

        FunctionInLet fileName range ->
            ( String.concat
                [ "Let statement containing functions should be avoided in \""
                , fileName
                , "\" at "
                , rangeToString range
                ]
            , [ range ]
            , False
            )

        SingleFieldRecord fileName range ->
            ( String.concat
                [ "Record has only one field. Use the field's type or introduce a Type. In file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]
            , [ range ]
            , False
            )

        Analyser.Messages.Types.DuplicateRecordFieldUpdate fileName fieldName ranges ->
            ( String.concat
                [ "The '"
                , fieldName
                , "' field for a record is updated multiple times in one expression in file "
                , fileName
                , "."
                ]
            , ranges
            , False
            )
