module Analyser.FileRef exposing (FileRef, decoder, encode)

import Json.Decode as JD exposing (Decoder)
import Json.Encode as JE exposing (Value)


type alias FileRef =
    { version : Sha1
    , path : String
    }


type alias Sha1 =
    String


decoder : Decoder FileRef
decoder =
    JD.string |> JD.map (FileRef "")


encode : FileRef -> Value
encode fileRef =
    JE.string fileRef.path
