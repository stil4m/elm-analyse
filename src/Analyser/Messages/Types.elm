module Analyser.Messages.Types exposing (..)

import AST.Ranges exposing (Range)
import AST.Types as AST


type alias Message =
    { id : Int
    , files : List ( Sha1, FileName )
    , data : MessageData
    }


type MessageData
    = UnreadableSourceFile FileName
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


type alias Sha1 =
    String


type alias FileName =
    String


type alias GetFiles =
    MessageData -> List FileName
