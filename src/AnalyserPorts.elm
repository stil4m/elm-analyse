port module AnalyserPorts exposing (loadFile, fileContent, sendMessagesAsStrings)

import Analyser.Messages exposing (Message)


port loadFile : String -> Cmd msg


port fileContent : (( String, String ) -> msg) -> Sub msg


port sendMessages : List String -> Cmd msg


sendMessagesAsStrings : List Message -> Cmd msg
sendMessagesAsStrings =
    List.map Analyser.Messages.asString >> sendMessages
