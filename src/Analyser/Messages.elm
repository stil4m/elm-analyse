module Analyser.Messages exposing (Message(..), asString, encodeMessage, decodeMessage)

import AST.Types as AST
import AST.Ranges as Ranges exposing (Range, rangeToString)
import Util.Json exposing (encodeTyped, decodeTyped)
import Json.Encode as JE
import Json.Decode as JD exposing (Decoder)
import Json.Decode.Extra exposing ((|:))


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
    | DuplicateImport FileName AST.ModuleName (List Range)
    | UnusedAlias FileName String Range
    | RedefineVariable FileName String Range Range
    | NoUnurriedPrefix FileName String Range
    | UnusedImportAlias FileName AST.ModuleName Range
    | UnusedImport FileName AST.ModuleName Range


type alias FileName =
    String


decodeFileVarNameAndRange : (String -> String -> Range -> Message) -> Decoder Message
decodeFileVarNameAndRange f =
    JD.succeed f
        |: fileField
        |: varNameField
        |: JD.field "range" Ranges.decode


decodeFileModuleNameAndRange : (String -> AST.ModuleName -> Range -> Message) -> Decoder Message
decodeFileModuleNameAndRange f =
    JD.succeed f
        |: fileField
        |: moduleNameField
        |: JD.field "range" Ranges.decode


decodeFileAndRange : (String -> Range -> Message) -> Decoder Message
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
                |: JD.field "ranged" (JD.list Ranges.decode)
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


encodeMessage : Message -> String
encodeMessage m =
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

        DuplicateImport fileName moduleName ranges ->
            String.concat
                [ "Duplicate import for module `"
                , String.join "." moduleName
                , "`in file \""
                , fileName
                , "\" at [ "
                , String.join " | " (List.map rangeToString ranges)
                , " ]"
                ]

        UnusedImportAlias fileName moduleName range ->
            String.concat
                [ "Unused import alias `"
                , String.join "." moduleName
                , "`in file \""
                , fileName
                , "\" at "
                , rangeToString range
                ]

        UnusedImport fileName moduleName range ->
            String.concat
                [ "Unused import `"
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
