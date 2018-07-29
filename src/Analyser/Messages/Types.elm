module Analyser.Messages.Types exposing (Message, MessageId, MessageStatus(..), newMessage, outdate)

import Analyser.FileRef exposing (FileRef)
import Analyser.Messages.Data as Data


type alias MessageId =
    Int


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
