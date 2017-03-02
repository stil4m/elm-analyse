module Analyser.Configuration exposing (..)

import Dict exposing (Dict)
import Json.Decode as JD exposing (..)
import Json.Decode.Extra exposing ((|:))


type Val
    = I Int
    | S String
    | B Bool


type Configuration
    = Configuration ConfigurationInner


type alias ConfigurationInner =
    { raw : String
    , checks : Dict String Bool
    }


checkEnabled : String -> Configuration -> Bool
checkEnabled k (Configuration configuration) =
    Dict.get k configuration.checks
        |> Maybe.withDefault True


defaultChecks : Dict String Bool
defaultChecks =
    Dict.fromList
        []


checkPropertyAsInt : String -> String -> Configuration -> Maybe Int
checkPropertyAsInt check prop (Configuration { raw }) =
    JD.decodeString (maybe (at [ check, prop ] int)) raw
        |> Result.toMaybe
        |> Maybe.andThen identity


defaultConfiguration : Configuration
defaultConfiguration =
    Configuration { raw = "", checks = defaultChecks }


withDefaultChecks : Dict String Bool -> Dict String Bool
withDefaultChecks x =
    Dict.merge
        Dict.insert
        (\k _ b result -> Dict.insert k b result)
        Dict.insert
        defaultChecks
        x
        Dict.empty


mergeWithDefaults : Configuration -> Configuration
mergeWithDefaults (Configuration { raw, checks }) =
    Configuration
        { raw = raw
        , checks = withDefaultChecks checks
        }


fromString : String -> ( Configuration, List String )
fromString input =
    if input == "" then
        ( defaultConfiguration
        , [ "No configuration provided. Using default configuration." ]
        )
    else
        case JD.decodeString (decodeConfiguration input) input of
            Err e ->
                ( defaultConfiguration
                , [ "Failed to decode defined configuration due to: " ++ e ++ ". Falling back to default configuration" ]
                )

            Ok x ->
                ( mergeWithDefaults x
                , []
                )


decodeConfiguration : String -> Decoder Configuration
decodeConfiguration raw =
    succeed (ConfigurationInner raw)
        |: oneOf [ (field "checks" decodeChecks), succeed Dict.empty ]
        |> map Configuration


decodeChecks : Decoder (Dict String Bool)
decodeChecks =
    dict bool
