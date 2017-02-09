module Analyser.Messages.Json exposing (encodeMessageData, decodeMessageData)

import AST.Types as AST
import Util.Json exposing (encodeTyped, decodeTyped)
import Json.Encode as JE
import Json.Decode as JD exposing (Decoder)
import Json.Decode.Extra exposing ((|:))
import Analyser.Messages.Types exposing (MessageData(..))
import AST.Ranges as Ranges exposing (Range)


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


decodeMessageData : Decoder MessageData
decodeMessageData =
    decodeTyped
        [ ( "UnreadableSourceFile", JD.string |> JD.map UnreadableSourceFile )
        , ( "UnreadableDependencyFile", JD.map2 UnreadableDependencyFile (JD.field "file" JD.string) (JD.field "dependency" JD.string) )
        , ( "UnusedVariable", decodeFileVarNameAndRange UnusedVariable )
        , ( "UnusedTopLevel", decodeFileVarNameAndRange UnusedTopLevel )
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
        , ( "NoUnurriedPrefix", decodeFileVarNameAndRange NoUnurriedPrefix )
        , ( "UnusedImportAlias", decodeFileModuleNameAndRange UnusedImportAlias )
        , ( "UnusedImport", decodeFileModuleNameAndRange UnusedImport )
        ]


encodeMessageData : MessageData -> String
encodeMessageData m =
    JE.encode 0 <|
        case m of
            UnreadableSourceFile s ->
                encodeTyped "UnreadableSourceFile" (JE.string s)

            UnreadableDependencyFile file dependency ->
                encodeTyped "UnreadableDependencyFile" <|
                    JE.object
                        [ ( "file", JE.string file )
                        , ( "dependency", JE.string dependency )
                        ]

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

            NoUnurriedPrefix file varName range ->
                encodeTyped "NoUnurriedPrefix" <|
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
