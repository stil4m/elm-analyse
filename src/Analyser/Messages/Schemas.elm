module Analyser.Messages.Schemas exposing (Schemas, buildSchemas, decoderFor)

import Analyser.Checks.Base exposing (Checker)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Schema exposing (Schema)
import Dict exposing (Dict)
import Json.Decode as JD exposing (Decoder)


type Schemas
    = Schemas (Dict String Schema)


buildSchemas : List Checker -> Schemas
buildSchemas checkerList =
    Schemas (checkerList |> List.map (\c -> ( c.info.key, c.info.schema )) |> Dict.fromList)


decoderFor : String -> Schemas -> Decoder MessageData
decoderFor s (Schemas d) =
    Dict.get s d
        |> Maybe.map Data.decode
        |> Maybe.withDefault (JD.fail "Unknown schema")
