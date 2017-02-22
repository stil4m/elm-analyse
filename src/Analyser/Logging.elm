port module Analyser.Logging exposing (log)


port log : ( String, String ) -> Cmd msg
