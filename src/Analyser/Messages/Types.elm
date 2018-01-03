module Analyser.Messages.Types exposing (Message, MessageId, MessageStatus(..), newMessage, outdate)

import Analyser.FileRef exposing (FileRef)
import Analyser.Messages.Data as Data


type alias MessageId =
    Int



--
-- type GroupedMessages
--     = GroupedMessages (Message -> String) (List ( String, List Message ))


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



--
-- groupByType : List Message -> GroupedMessages
-- groupByType messages =
--     messages
--         |> Dict.groupBy .type_
--         |> Dict.toList
--         |> List.sortBy Tuple.first
--         |> GroupedMessages (.file >> .path)
--
--
-- groupByFileName : List Message -> GroupedMessages
-- groupByFileName messages =
--     messages
--         |> List.map (\m -> ( m.file.path, m ))
--         |> Dict.groupBy Tuple.first
--         |> Dict.map (\_ v -> List.map Tuple.second v)
--         |> Dict.toList
--         |> List.sortBy Tuple.first
--         |> GroupedMessages .type_
