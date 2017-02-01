port module AnalyserPorts exposing (loadFile, fileContent, sendMessagesAsStrings, storeAstForSha)

import Analyser.Messages exposing (Message)
import Analyser.Types exposing (FileContent)


port loadFile : String -> Cmd msg


port fileContent : (FileContent -> msg) -> Sub msg


port sendMessages : List String -> Cmd msg


port storeAstForSha : ( String, String ) -> Cmd msg


sendMessagesAsStrings : List Message -> Cmd msg
sendMessagesAsStrings =
    List.map Analyser.Messages.asString >> sendMessages
