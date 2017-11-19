module Analyser.Messages.Types exposing (..)

import Analyser.FileRef exposing (FileRef)
import Analyser.Messages.Data as Data
import Dict exposing (Dict)
import Dict.Extra as Dict


type alias MessageId =
    Int


type alias FileName =
    String


type alias GroupedMessages =
    Dict String (List Message)


type alias Message =
    { id : MessageId
    , status : MessageStatus
    , file : FileRef
    , type_ : String
    , data : Data.MessageData
    }


newMessage : FileRef -> String -> Data.MessageData -> Message
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
        |> List.map (\m -> ( m.file.path, m ))
        |> Dict.groupBy Tuple.first
        |> Dict.map (\_ v -> List.map Tuple.second v)
