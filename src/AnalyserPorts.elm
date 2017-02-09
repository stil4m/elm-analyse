port module AnalyserPorts exposing (sendMessagesAsJson, sendMessagesAsStrings, onReset)

import Analyser.Messages.Types exposing (MessageData)
import Analyser.Messages.Util as Messages
import Analyser.Messages.Json as Messages


port messagesAsJson : List String -> Cmd msg


port sendMessages : List String -> Cmd msg


port onReset : (Bool -> msg) -> Sub msg


sendMessagesAsJson : List MessageData -> Cmd msg
sendMessagesAsJson =
    List.map Messages.encodeMessageData >> messagesAsJson


sendMessagesAsStrings : List MessageData -> Cmd msg
sendMessagesAsStrings =
    List.map Messages.asString >> sendMessages
