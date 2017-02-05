module Client.DashBoard.State exposing (..)

import Json.Decode as JD exposing (Decoder)
import Json.Decode.Extra exposing ((|:))
import Analyser.Messages as Messages exposing (Message)


type alias State =
    { loading : Bool
    , messages : List Message
    }


decodeState : Decoder State
decodeState =
    JD.succeed State
        |: JD.field "loading" JD.bool
        |: JD.field "messages" (JD.list Messages.decodeMessage)
