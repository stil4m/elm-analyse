module Analyser.Configuration exposing (..)

import Dict exposing (Dict)
import Json.Decode as JD exposing (..)
import Json.Decode.Extra exposing ((|:))


type alias Configuration =
    { checks : Dict String Bool }


defaultChecks : Dict String Bool
defaultChecks =
    Dict.fromList
        [ ( "ImportAll", False ) ]


defaultConfiguration : Configuration
defaultConfiguration =
    { checks = defaultChecks }


withDefaultChecks : Dict String Bool -> Dict String Bool
withDefaultChecks x =
    Dict.merge
        (Dict.insert)
        (\k a b result -> Dict.insert k b result)
        (Dict.insert)
        defaultChecks
        x
        Dict.empty


mergeWithDefaults : Configuration -> Configuration
mergeWithDefaults { checks } =
    { checks = withDefaultChecks checks
    }


fromString : String -> ( Configuration, List String )
fromString input =
    case JD.decodeString decodeConfiguration input of
        Err e ->
            ( defaultConfiguration
            , [ "Failed to decode defined configuration due to: " ++ e ++ ". Falling back to default configuration" ]
            )

        Ok x ->
            ( mergeWithDefaults x
            , []
            )


decodeConfiguration : Decoder Configuration
decodeConfiguration =
    succeed Configuration
        |: (field "checks" decodeChecks)


decodeChecks : Decoder (Dict String Bool)
decodeChecks =
    dict bool
