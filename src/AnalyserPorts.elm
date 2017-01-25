port module AnalyserPorts exposing (..)


port loadFile : String -> Cmd msg


port fileContent : (( String, String ) -> msg) -> Sub msg
