port module AnalyserPorts exposing (sendMessagesAsJson, sendMessagesAsStrings, onReset, onFixMessage)

import Analyser.Messages.Types exposing (Message)
import Analyser.Messages.Util as Messages
import Analyser.Messages.Json as Messages


port messagesAsJson : List String -> Cmd msg


port sendMessages : List String -> Cmd msg


port onReset : (Bool -> msg) -> Sub msg


port onFixMessage : (Int -> msg) -> Sub msg


sendMessagesAsJson : List Message -> Cmd msg
sendMessagesAsJson =
    List.map Messages.encodeMessage >> messagesAsJson


sendMessagesAsStrings : List Message -> Cmd msg
sendMessagesAsStrings =
    List.map (.data >> Messages.asString) >> sendMessages
