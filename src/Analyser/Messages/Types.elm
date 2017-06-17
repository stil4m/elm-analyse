module Analyser.Messages.Types exposing (..)

import Analyser.Messages.Range exposing (Range)
import Elm.Syntax.Base exposing (ModuleName)


type alias MessageId =
    Int


type alias Sha1 =
    String


type alias FileName =
    String


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


type MessageData
    = UnreadableSourceFile FileName
    | UnusedVariable FileName String Range
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
    | NonStaticRegex FileName Range
    | CoreArrayUsage FileName Range
    | FunctionInLet FileName Range


type alias GetFiles =
    MessageData -> List FileName
