module Analyser.Configuration exposing (Configuration, checkEnabled, checkPropertyAs, defaultConfiguration, fromString, isPathExcluded)

import Dict exposing (Dict)
import Json.Decode as JD exposing (Decoder)


type Configuration
    = Configuration ConfigurationInner


type alias ConfigurationInner =
    { raw : String
    , checks : Dict String Bool
    , excludedPaths : List String
    }


checkEnabled : String -> Configuration -> Bool
checkEnabled k (Configuration configuration) =
    Dict.get k configuration.checks
        |> Maybe.withDefault True


isPathExcluded : String -> Configuration -> Bool
isPathExcluded p (Configuration { excludedPaths }) =
    List.any (\a -> String.startsWith a p) excludedPaths


defaultChecks : Dict String Bool
defaultChecks =
    Dict.fromList
        [ ( "FunctionInLet", False ) ]


checkPropertyAs : Decoder a -> String -> String -> Configuration -> Maybe a
checkPropertyAs decoder check prop (Configuration { raw }) =
    JD.decodeString (JD.maybe (JD.at [ check, prop ] decoder)) raw
        |> Result.toMaybe
        |> Maybe.andThen identity


defaultConfiguration : Configuration
defaultConfiguration =
    Configuration { raw = "", checks = defaultChecks, excludedPaths = [] }


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
mergeWithDefaults (Configuration innerConfig) =
    Configuration { innerConfig | checks = withDefaultChecks innerConfig.checks }


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
                , [ "Failed to decode defined configuration due to: " ++ JD.errorToString e ++ ". Falling back to default configuration" ]
                )

            Ok x ->
                ( mergeWithDefaults x
                , []
                )


decodeConfiguration : String -> Decoder Configuration
decodeConfiguration raw =
    JD.map2 (ConfigurationInner raw)
        (JD.oneOf [ JD.field "checks" decodeChecks, JD.succeed Dict.empty ])
        (JD.oneOf [ JD.field "excludedPaths" (JD.list JD.string), JD.succeed [] ])
        |> JD.map Configuration


decodeChecks : Decoder (Dict String Bool)
decodeChecks =
    JD.dict JD.bool
