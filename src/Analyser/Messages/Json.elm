module Analyser.Messages.Json exposing (serialiseMessage, encodeMessage, decodeMessage)

import AST.Ranges as Ranges exposing (Range)
import AST.Types as AST
import Analyser.Messages.Types exposing (Message, MessageData(..), MessageStatus(..))
import Json.Decode as JD exposing (Decoder)
import Json.Decode.Extra exposing ((|:))
import Json.Encode as JE
import Util.Json exposing (decodeTyped, encodeTyped)


decodeFileVarNameAndRange : (String -> String -> Range -> MessageData) -> Decoder MessageData
decodeFileVarNameAndRange f =
    JD.succeed f
        |: fileField
        |: varNameField
        |: JD.field "range" Ranges.decode


decodeFileModuleNameAndRange : (String -> AST.ModuleName -> Range -> MessageData) -> Decoder MessageData
decodeFileModuleNameAndRange f =
    JD.succeed f
        |: fileField
        |: moduleNameField
        |: JD.field "range" Ranges.decode


decodeFileAndRange : (String -> Range -> MessageData) -> Decoder MessageData
decodeFileAndRange f =
    JD.succeed f
        |: fileField
        |: JD.field "range" Ranges.decode


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
        , ( "UnformattedFile", JD.map UnformattedFile fileField )
        , ( "DuplicateImport"
          , JD.succeed DuplicateImport
                |: fileField
                |: moduleNameField
                |: JD.field "ranges" (JD.list Ranges.decode)
          )
        , ( "UnusedAlias", decodeFileVarNameAndRange UnusedAlias )
        , ( "RedefineVariable"
          , JD.succeed RedefineVariable
                |: fileField
                |: varNameField
                |: JD.field "range1" Ranges.decode
                |: JD.field "range2" Ranges.decode
          )
        , ( "NoUncurriedPrefix", decodeFileVarNameAndRange NoUncurriedPrefix )
        , ( "UnusedImportAlias", decodeFileModuleNameAndRange UnusedImportAlias )
        , ( "UnusedImport", decodeFileModuleNameAndRange UnusedImport )
        , ( "UseConsOverConcat", decodeFileAndRange UseConsOverConcat )
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
                    , ( "range", Ranges.encode range )
                    ]

        UnusedTopLevel file varName range ->
            encodeTyped "UnusedTopLevel" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "varName", JE.string varName )
                    , ( "range", Ranges.encode range )
                    ]

        UnusedImportedVariable file varName range ->
            encodeTyped "UnusedImportedVariable" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "varName", JE.string varName )
                    , ( "range", Ranges.encode range )
                    ]

        UnusedPatternVariable file varName range ->
            encodeTyped "UnusedPatternVariable" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "varName", JE.string varName )
                    , ( "range", Ranges.encode range )
                    ]

        ExposeAll file range ->
            encodeTyped "ExposeAll" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "range", Ranges.encode range )
                    ]

        ImportAll file moduleName range ->
            encodeTyped "ImportAll" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "moduleName", JE.list <| List.map JE.string moduleName )
                    , ( "range", Ranges.encode range )
                    ]

        NoTopLevelSignature file varName range ->
            encodeTyped "NoTopLevelSignature" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "varName", JE.string varName )
                    , ( "range", Ranges.encode range )
                    ]

        UnnecessaryParens file range ->
            encodeTyped "UnnecessaryParens" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "range", Ranges.encode range )
                    ]

        DebugLog file range ->
            encodeTyped "DebugLog" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "range", Ranges.encode range )
                    ]

        DebugCrash file range ->
            encodeTyped "DebugCrash" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "range", Ranges.encode range )
                    ]

        UnformattedFile file ->
            encodeTyped "UnformattedFile" <|
                JE.object
                    [ ( "file", JE.string file )
                    ]

        DuplicateImport file moduleName ranges ->
            encodeTyped "DuplicateImport" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "moduleName", JE.list <| List.map JE.string moduleName )
                    , ( "ranges", JE.list <| List.map Ranges.encode ranges )
                    ]

        UnusedAlias file varName range ->
            encodeTyped "UnusedAlias" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "varName", JE.string varName )
                    , ( "range", Ranges.encode range )
                    ]

        RedefineVariable file varName range1 range2 ->
            encodeTyped "RedefineVariable" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "varName", JE.string varName )
                    , ( "range1", Ranges.encode range1 )
                    , ( "range2", Ranges.encode range2 )
                    ]

        NoUncurriedPrefix file varName range ->
            encodeTyped "NoUncurriedPrefix" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "varName", JE.string varName )
                    , ( "range", Ranges.encode range )
                    ]

        UnusedImportAlias file moduleName range ->
            encodeTyped "UnusedImportAlias" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "moduleName", JE.list <| List.map JE.string moduleName )
                    , ( "range", Ranges.encode range )
                    ]

        UnusedImport file moduleName range ->
            encodeTyped "UnusedImport" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "moduleName", JE.list <| List.map JE.string moduleName )
                    , ( "range", Ranges.encode range )
                    ]

        UseConsOverConcat file range ->
            encodeTyped "UseConsOverConcat" <|
                JE.object
                    [ ( "file", JE.string file )
                    , ( "range", Ranges.encode range )
                    ]
