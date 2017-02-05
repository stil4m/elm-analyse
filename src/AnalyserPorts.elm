port module AnalyserPorts exposing (sendMessagesAsStrings)

import Analyser.Messages exposing (Message)


-- port loadFile : String -> Cmd msg
--
--
-- port fileContent : (FileContent -> msg) -> Sub msg
--
--
-- port storeAstForSha : ( String, String ) -> Cmd msg


port sendMessages : List String -> Cmd msg


sendMessagesAsStrings : List Message -> Cmd msg
sendMessagesAsStrings =
    List.map Analyser.Messages.asString >> sendMessages
