port module Ports exposing (onFile, parseResponse)

-- This is needed for a ref error

import Json.Decode


port onFile : (( String, String ) -> msg) -> Sub msg


port parseResponse : ( String, String, Float ) -> Cmd msg
