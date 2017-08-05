module Analyser.Messages.Json exposing (decodeMessage, encodeMessage, serialiseMessage)

import Analyser.Messages.Range as Range exposing (Range)
import Analyser.Messages.Types exposing (Message, MessageData(..), MessageStatus(..))
import Elm.Syntax.Base as AST
import Json.Decode as JD exposing (Decoder)
import Json.Decode.Extra exposing ((|:))
import Json.Encode as JE
import Util.Json exposing (decodeTyped, encodeTyped)


decodeFileVarNameAndRange : (String -> String -> Range -> MessageData) -> Decoder MessageData
decodeFileVarNameAndRange f =
    JD.succeed f
        |: fileField
        |: varNameField
        |: JD.field "range" Range.decode


decodeFileModuleNameAndRange : (String -> AST.ModuleName -> Range -> MessageData) -> Decoder MessageData
decodeFileModuleNameAndRange f =
    JD.succeed f
        |: fileField
        |: moduleNameField
        |: JD.field "range" Range.decode


decodeFileAndRange : (String -> Range -> MessageData) -> Decoder MessageData
decodeFileAndRange f =
    JD.succeed f
        |: fileField
        |: JD.field "range" Range.decode


varNameField : Decoder String
varNameField =
    JD.field "varName" JD.string


moduleNameField : Decoder (List String)
moduleNameField =
    JD.field "moduleName" (JD.list JD.string)


fileField : Decoder String
fileField =
    JD.field "file" JD.string


decodeMessage : Decoder Message
decodeMessage =
    JD.succeed Message
        |: JD.field "id" JD.int
        |: JD.field "status" decodeMessageStatus
        |: JD.field "files" (JD.list decodeMessageFile)
        |: JD.field "data" decodeMessageData


decodeMessageStatus : Decoder MessageStatus
decodeMessageStatus =
    JD.andThen
        (\x ->
            case x of
                "outdated" ->
                    JD.succeed Outdated

                "blocked" ->
                    JD.succeed Blocked

                "applicable" ->
                    JD.succeed Applicable

                "fixing" ->
                    JD.succeed Fixing

                _ ->
                    JD.fail ("Expecected message status, but got: " ++ x)
        )
        JD.string


decodeMessageFile : Decoder ( String, String )
decodeMessageFile =
    JD.succeed (,)
        |: JD.field "sha1" JD.string
        |: JD.field "path" JD.string


decodeMessageData : Decoder MessageData
decodeMessageData =
    decodeTyped
        [ ( "UnreadableSourceFile", JD.string |> JD.map UnreadableSourceFile )
        , ( "UnusedVariable", decodeFileVarNameAndRange UnusedVariable )
        , ( "UnusedTopLevel", decodeFileVarNameAndRange UnusedTopLevel )
        , ( "UnusedImportedVariable", decodeFileVarNameAndRange UnusedImportedVariable )
        , ( "UnusedPatternVariable", decodeFileVarNameAndRange UnusedPatternVariable )
        , ( "ExposeAll", decodeFileAndRange ExposeAll )
        , ( "ImportAll", decodeFileModuleNameAndRange ImportAll )
        , ( "NoTopLevelSignature", decodeFileVarNameAndRange NoTopLevelSignature )
        , ( "UnnecessaryParens", decodeFileAndRange UnnecessaryParens )
        , ( "DebugLog", decodeFileAndRange DebugLog )
        , ( "DebugCrash", decodeFileAndRange DebugCrash )
        , ( "MultiLineRecordFormatting", decodeFileAndRange MultiLineRecordFormatting )
        , ( "UnformattedFile", JD.map UnformattedFile fileField )
        , ( "UnnecessaryPortModule", JD.map UnnecessaryPortModule fileField )
        , ( "FileLoadFailed", JD.map2 FileLoadFailed fileField (JD.field "message" JD.string) )
        , ( "DuplicateImport"
          , JD.succeed DuplicateImport
                |: fileField
                |: moduleNameField
                |: JD.field "ranges" (JD.list Range.decode)
          )
        , ( "DuplicateImportedVariable"
          , JD.succeed DuplicateImportedVariable
                |: fileField
                |: moduleNameField
                |: JD.field "varName" JD.string
                |: JD.field "ranges" (JD.list Range.decode)
          )
        , ( "UnusedTypeAlias", decodeFileVarNameAndRange UnusedTypeAlias )
        , ( "RedefineVariable"
          , JD.succeed RedefineVariable
                |: fileField
                |: varNameField
                |: JD.field "range1" Range.decode
                |: JD.field "range2" Range.decode
          )
        , ( "LineLengthExceeded"
          , JD.succeed LineLengthExceeded
                |: fileField
                |: JD.field "ranges" (JD.list Range.decode)
          )
        , ( "NoUncurriedPrefix", decodeFileVarNameAndRange NoUncurriedPrefix )
        , ( "UnusedImportAlias", decodeFileModuleNameAndRange UnusedImportAlias )
        , ( "UnusedImport", decodeFileModuleNameAndRange UnusedImport )
        , ( "UseConsOverConcat", decodeFileAndRange UseConsOverConcat )
        , ( "DropConcatOfLists", decodeFileAndRange DropConcatOfLists )
        , ( "DropConsOfItemAndList", decodeFileAndRange DropConsOfItemAndList )
        , ( "UnnecessaryListConcat", decodeFileAndRange UnnecessaryListConcat )
        , ( "TriggerWord", JD.map3 TriggerWord fileField (JD.field "word" JD.string) (JD.field "range" Range.decode) )
        , ( "NonStaticRegex", decodeFileAndRange NonStaticRegex )
        , ( "CoreArrayUsage", decodeFileAndRange CoreArrayUsage )
        , ( "FunctionInLet", decodeFileAndRange FunctionInLet )
        , ( "SingleFieldRecord", decodeFileAndRange SingleFieldRecord )
        , ( "DuplicateRecordFieldUpdate"
          , JD.succeed DuplicateRecordFieldUpdate
                |: fileField
                |: JD.field "fieldName" JD.string
                |: JD.field "ranges" (JD.list Range.decode)
          )
        ]


serialiseMessage : Message -> String
serialiseMessage =
    JE.encode 0 << encodeMessage


encodeMessage : Message -> JE.Value
encodeMessage m =
    JE.object
        [ ( "id", JE.int m.id )
        , ( "status", encodeMessageStatus m.status )
        , ( "files"
          , JE.list <|
                List.map
                    (\( s, p ) ->
                        JE.object
                            [ ( "path", JE.string p )
                            , ( "sha1", JE.string s )
                            ]
                    )
                    m.files
          )
        , ( "data", encodeMessageData m.data )
        ]


encodeMessageStatus : MessageStatus -> JE.Value
encodeMessageStatus m =
    JE.string <|
        case m of
            Applicable ->
                "applicable"

            Outdated ->
                "outdated"

            Blocked ->
                "blocked"

            Fixing ->
                "fixing"


encodeMessageData : MessageData -> JE.Value
encodeMessageData m =
    case m of
        UnreadableSourceFile s ->
            encodeTyped "UnreadableSourceFile" (JE.string s)

        UnusedVariable file varName range ->
            encodeTyped "UnusedVariable" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "varName", JE.string varName )
                    , ( "range", Range.encode range )
                    ]

        UnusedTopLevel file varName range ->
            encodeTyped "UnusedTopLevel" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "varName", JE.string varName )
                    , ( "range", Range.encode range )
                    ]

        UnusedImportedVariable file varName range ->
            encodeTyped "UnusedImportedVariable" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "varName", JE.string varName )
                    , ( "range", Range.encode range )
                    ]

        UnusedPatternVariable file varName range ->
            encodeTyped "UnusedPatternVariable" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "varName", JE.string varName )
                    , ( "range", Range.encode range )
                    ]

        ExposeAll file range ->
            encodeTyped "ExposeAll" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "range", Range.encode range )
                    ]

        ImportAll file moduleName range ->
            encodeTyped "ImportAll" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "moduleName", JE.list <| List.map JE.string moduleName )
                    , ( "range", Range.encode range )
                    ]

        NoTopLevelSignature file varName range ->
            encodeTyped "NoTopLevelSignature" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "varName", JE.string varName )
                    , ( "range", Range.encode range )
                    ]

        UnnecessaryParens file range ->
            encodeTyped "UnnecessaryParens" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "range", Range.encode range )
                    ]

        MultiLineRecordFormatting file range ->
            encodeTyped "MultiLineRecordFormatting" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "range", Range.encode range )
                    ]

        DebugLog file range ->
            encodeTyped "DebugLog" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "range", Range.encode range )
                    ]

        DebugCrash file range ->
            encodeTyped "DebugCrash" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "range", Range.encode range )
                    ]

        UnformattedFile file ->
            encodeTyped "UnformattedFile" <|
                JE.object
                    [ ( "file", JE.string file )
                    ]

        UnnecessaryPortModule file ->
            encodeTyped "UnnecessaryPortModule" <|
                JE.object
                    [ ( "file", JE.string file )
                    ]

        FileLoadFailed file message ->
            encodeTyped "FileLoadFailed" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "message", JE.string message )
                    ]

        DuplicateImport file moduleName ranges ->
            encodeTyped "DuplicateImport" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "moduleName", JE.list <| List.map JE.string moduleName )
                    , ( "ranges", JE.list <| List.map Range.encode ranges )
                    ]

        DuplicateImportedVariable file moduleName name ranges ->
            encodeTyped "DuplicateImportedVariable" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "moduleName", JE.list <| List.map JE.string moduleName )
                    , ( "varName", JE.string name )
                    , ( "ranges", JE.list <| List.map Range.encode ranges )
                    ]

        UnusedTypeAlias file varName range ->
            encodeTyped "UnusedTypeAlias" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "varName", JE.string varName )
                    , ( "range", Range.encode range )
                    ]

        RedefineVariable file varName range1 range2 ->
            encodeTyped "RedefineVariable" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "varName", JE.string varName )
                    , ( "range1", Range.encode range1 )
                    , ( "range2", Range.encode range2 )
                    ]

        NoUncurriedPrefix file varName range ->
            encodeTyped "NoUncurriedPrefix" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "varName", JE.string varName )
                    , ( "range", Range.encode range )
                    ]

        UnusedImportAlias file moduleName range ->
            encodeTyped "UnusedImportAlias" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "moduleName", JE.list <| List.map JE.string moduleName )
                    , ( "range", Range.encode range )
                    ]

        UnusedImport file moduleName range ->
            encodeTyped "UnusedImport" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "moduleName", JE.list <| List.map JE.string moduleName )
                    , ( "range", Range.encode range )
                    ]

        UseConsOverConcat file range ->
            encodeTyped "UseConsOverConcat" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "range", Range.encode range )
                    ]

        DropConcatOfLists file range ->
            encodeTyped "DropConcatOfLists" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "range", Range.encode range )
                    ]

        DropConsOfItemAndList file range ->
            encodeTyped "DropConsOfItemAndList" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "range", Range.encode range )
                    ]

        UnnecessaryListConcat file range ->
            encodeTyped "UnnecessaryListConcat" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "range", Range.encode range )
                    ]

        LineLengthExceeded file ranges ->
            encodeTyped "LineLengthExceeded" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "ranges", JE.list (List.map Range.encode ranges) )
                    ]

        TriggerWord file word range ->
            encodeTyped "TriggerWord" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "word", JE.string word )
                    , ( "range", Range.encode range )
                    ]

        NonStaticRegex file range ->
            encodeTyped "NonStaticRegex" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "range", Range.encode range )
                    ]

        CoreArrayUsage file range ->
            encodeTyped "CoreArrayUsage" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "range", Range.encode range )
                    ]

        FunctionInLet file range ->
            encodeTyped "FunctionInLet" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "range", Range.encode range )
                    ]

        SingleFieldRecord fileName range ->
            encodeTyped "SingleFieldRecord" <|
                JE.object
                    [ ( "file", JE.string fileName )
                    , ( "range", Range.encode range )
                    ]

        DuplicateRecordFieldUpdate fileName fieldName ranges ->
            JE.object
                [ ( "file", JE.string fileName )
                , ( "fieldName", JE.string fieldName )
                , ( "ranges", JE.list <| List.map Range.encode ranges )
                ]
