module Analyser.Messages.Json exposing (decodeMessage, encodeMessage, serialiseMessage)

import Analyser.FileRef as FileRef
import Analyser.Messages.Data as Data
import Analyser.Messages.Schemas as Schemas exposing (Schemas)
import Analyser.Messages.Types exposing (Message, MessageStatus(..))
import Json.Decode as JD exposing (Decoder)
import Json.Encode as JE


decodeMessage : Schemas -> Decoder Message
decodeMessage schemas =
    JD.field "type" JD.string
        |> JD.andThen
            (\t ->
                JD.map5 Message
                    (JD.field "id" JD.int)
                    (JD.field "status" decodeMessageStatus)
                    (JD.field "file" FileRef.decoder)
                    (JD.succeed t)
                    (JD.field "data" (Schemas.decoderFor t schemas))
            )


decodeMessageStatus : Decoder MessageStatus
decodeMessageStatus =
    JD.andThen
        (\x ->
            case x of
                "outdated" ->
                    JD.succeed Outdated

                "blocked" ->
                    JD.succeed Blocked

                "applicable" ->
                    JD.succeed Applicable

                "fixing" ->
                    JD.succeed Fixing

                _ ->
                    JD.fail ("Expecected message status, but got: " ++ x)
        )
        JD.string


serialiseMessage : Message -> String
serialiseMessage =
    JE.encode 0 << encodeMessage


encodeMessage : Message -> JE.Value
encodeMessage m =
    JE.object <|
        [ ( "id", JE.int m.id )
        , ( "status", encodeMessageStatus m.status )
        , ( "file", FileRef.encode m.file )
        , ( "type", JE.string m.type_ )
        , ( "data", Data.encode m.data )
        ]


encodeMessageStatus : MessageStatus -> JE.Value
encodeMessageStatus m =
    JE.string <|
        case m of
            Applicable ->
                "applicable"

            Outdated ->
                "outdated"

            Blocked ->
                "blocked"

            Fixing ->
                "fixing"
