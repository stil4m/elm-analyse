port module AnalyserPorts exposing (onFixMessage, onReset, sendMessagesAsJson, sendMessagesAsStrings, sendStateAsJson)

import Analyser.Messages.Json as Messages
import Analyser.Messages.Types exposing (Message)
import Analyser.Messages.Util as Messages
import Analyser.State exposing (State, encodeState)
import Json.Encode as JE


port messagesAsJson : List String -> Cmd msg


port sendMessages : List String -> Cmd msg


port sendState : String -> Cmd msg


port onReset : (Bool -> msg) -> Sub msg


port onFixMessage : (Int -> msg) -> Sub msg


sendStateAsJson : State -> Cmd msg
sendStateAsJson =
    sendState << JE.encode 0 << encodeState


sendMessagesAsJson : List Message -> Cmd msg
sendMessagesAsJson =
    List.map Messages.serialiseMessage >> messagesAsJson


sendMessagesAsStrings : List Message -> Cmd msg
sendMessagesAsStrings =
    List.map (.data >> Messages.asString) >> sendMessages
