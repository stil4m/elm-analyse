port module AnalyserPorts exposing (sendMessagesAsJson, sendMessagesAsStrings)

import Analyser.Messages exposing (Message)


port messagesAsJson : List String -> Cmd msg


port sendMessages : List String -> Cmd msg


sendMessagesAsJson : List Message -> Cmd msg
sendMessagesAsJson =
    List.map Analyser.Messages.encodeMessage >> messagesAsJson


sendMessagesAsStrings : List Message -> Cmd msg
sendMessagesAsStrings =
    List.map Analyser.Messages.asString >> sendMessages
