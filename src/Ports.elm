port module Ports exposing (..)

import Json.Decode


port onFile : (( String, String ) -> msg) -> Sub msg


port parseResponse : ( String, String, Float ) -> Cmd msg
