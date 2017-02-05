module Client.DashBoard.State exposing (..)

import Json.Decode as JD exposing (Decoder)
import Json.Decode.Extra exposing ((|:))


type alias State =
    { loading : Bool
    , messages : List String
    }


decodeState : Decoder State
decodeState =
    JD.succeed State
        |: JD.field "loading" JD.bool
        |: JD.field "messages" (JD.list JD.string)
