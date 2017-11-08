module Analyser.Messages.Types exposing (..)

import Analyser.Messages.Range exposing (Range)
import Dict exposing (Dict)
import Dict.Extra as Dict
import Elm.Syntax.Base exposing (ModuleName)
import List.Extra as List


type alias MessageId =
    Int


type alias Sha1 =
    String


type alias FileName =
    String


type alias GroupedMessages =
    Dict String (List Message)


type alias Message =
    { id : MessageId
    , status : MessageStatus
    , files : List ( Sha1, FileName )
    , data : MessageData
    }


newMessage : List ( Sha1, FileName ) -> MessageData -> Message
newMessage =
    Message 0 Applicable


outdate : Message -> Message
outdate m =
    { m | status = Outdated }


type MessageStatus
    = Outdated
    | Blocked
    | Fixing
    | Applicable


groupByType : List Message -> GroupedMessages
groupByType messages =
    messages
        |> Dict.groupBy (\m -> String.split " " (toString m.data) |> List.head |> Maybe.withDefault "")


groupByFileName : List Message -> GroupedMessages
groupByFileName messages =
    messages
        |> List.concatMap (\m -> List.map (\f -> ( Tuple.second f, m )) m.files)
        |> Dict.groupBy Tuple.first
        |> Dict.map (\_ v -> List.map Tuple.second v)


type MessageData
    = UnusedVariable FileName String Range
    | UnusedTopLevel FileName String Range
    | UnusedImportedVariable FileName String Range
    | UnusedPatternVariable FileName String Range
    | ExposeAll FileName Range
    | ImportAll FileName ModuleName Range
    | NoTopLevelSignature FileName String Range
    | UnnecessaryParens FileName Range
    | DebugLog FileName Range
    | DebugCrash FileName Range
    | UnformattedFile FileName
    | FileLoadFailed FileName String
    | DuplicateImport FileName ModuleName (List Range)
    | DuplicateImportedVariable FileName ModuleName String (List Range)
    | UnusedTypeAlias FileName String Range
    | RedefineVariable FileName String Range Range
    | NoUncurriedPrefix FileName String Range
    | UnusedImportAlias FileName ModuleName Range
    | UnusedImport FileName ModuleName Range
    | UseConsOverConcat FileName Range
    | DropConcatOfLists FileName Range
    | DropConsOfItemAndList FileName Range
    | UnnecessaryListConcat FileName Range
    | LineLengthExceeded FileName (List Range)
    | MultiLineRecordFormatting FileName Range
    | UnnecessaryPortModule FileName
    | TriggerWord FileName String Range
    | NonStaticRegex FileName Range
    | CoreArrayUsage FileName Range
    | FunctionInLet FileName Range
    | SingleFieldRecord FileName Range
    | DuplicateRecordFieldUpdate FileName String (List Range)
