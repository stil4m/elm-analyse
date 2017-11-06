module Util.Json exposing (decodeTyped, encodeTyped)

import Json.Decode as JD exposing (Decoder)
import Json.Encode as JE exposing (Value)


encodeTyped : String -> Value -> List ( String, Value )
encodeTyped x v =
    [ ( "type", JE.string x )
    , ( "value", v )
    ]


decodeTyped : List ( String, Decoder a ) -> Decoder a
decodeTyped opts =
    JD.lazy
        (\() ->
            JD.field "type" JD.string
                |> JD.andThen
                    (\t ->
                        case List.filter (Tuple.first >> (==) t) opts |> List.head of
                            Just m ->
                                JD.field "value" <| Tuple.second m

                            Nothing ->
                                JD.fail ("No decoder for type: " ++ t)
                    )
        )
