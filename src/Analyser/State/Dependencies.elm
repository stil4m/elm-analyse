module Analyser.State.Dependencies exposing (Dependencies, DependencyInfo, VersionState(..), decode, encode, init, none)

import Analyser.Files.Json
import Dict exposing (Dict)
import Elm.Dependency exposing (Dependency)
import Json.Decode as JD exposing (Decoder)
import Json.Decode.Extra exposing ((|:))
import Json.Encode as JE exposing (Value)
import Registry exposing (Registry)
import Registry.Package as Package exposing (Package)
import Registry.Version as Version


type alias Dependencies =
    { values : Dict String DependencyInfo
    , unused : List String
    }


type alias DependencyInfo =
    { dependency : Dependency
    , versionState : VersionState
    , package : Maybe Package
    }


decode : Decoder Dependencies
decode =
    JD.succeed Dependencies
        |: JD.field "values" (JD.dict decodeDependencyInfo)
        |: JD.field "unused" (JD.list JD.string)


encode : Dependencies -> Value
encode dependencies =
    JE.object
        [ ( "values"
          , dependencies.values
                |> Dict.map (\_ -> encodeDependencyInfo)
                |> Dict.toList
                |> JE.object
          )
        , ( "unused", JE.list (List.map JE.string dependencies.unused) )
        ]


encodeDependencyInfo : DependencyInfo -> Value
encodeDependencyInfo depInfo =
    JE.object
        [ ( "dependency", Analyser.Files.Json.encodeDependency depInfo.dependency )
        , ( "versionState", encodeVersionState depInfo.versionState )
        , ( "package", Maybe.withDefault JE.null <| Maybe.map Package.encode depInfo.package )
        ]


decodeDependencyInfo : Decoder DependencyInfo
decodeDependencyInfo =
    JD.succeed DependencyInfo
        |: JD.field "dependency" Analyser.Files.Json.decodeDependency
        |: JD.field "versionState" decodeVersionState
        |: JD.field "package" (JD.maybe Package.decode)


encodeVersionState : VersionState -> Value
encodeVersionState vs =
    JE.string <|
        case vs of
            UpToDate ->
                "UpToDate"

            MajorBehind ->
                "MajorBehind"

            Upgradable ->
                "Upgradable"

            Unknown ->
                "Unknown"


decodeVersionState : Decoder VersionState
decodeVersionState =
    JD.string
        |> JD.andThen
            (\s ->
                case s of
                    "UpToDate" ->
                        JD.succeed UpToDate

                    "MajorBehind" ->
                        JD.succeed MajorBehind

                    "Upgradable" ->
                        JD.succeed Upgradable

                    "Unknown" ->
                        JD.succeed Unknown

                    _ ->
                        JD.fail "Unknown version state"
            )


dependencyInfo : Dependency -> Registry -> DependencyInfo
dependencyInfo dep registry =
    let
        package =
            Registry.lookup dep.name registry

        versionState =
            package
                |> Maybe.map (computeVersionState dep)
                |> Maybe.withDefault Unknown
    in
    { dependency = dep
    , versionState = versionState
    , package = package
    }


computeVersionState : Dependency -> Package -> VersionState
computeVersionState dep pack =
    case Version.fromString dep.version of
        Err _ ->
            Unknown

        Ok current ->
            case Package.newestVersion pack of
                Nothing ->
                    Unknown

                Just newest ->
                    if current == newest then
                        UpToDate
                    else if Version.isMajorUpgrade current newest then
                        MajorBehind
                    else
                        Upgradable


none : Dependencies
none =
    { values = Dict.empty, unused = [] }


init : List String -> List Dependency -> Registry -> Dependencies
init unused dependencies registry =
    { values =
        dependencies
            |> List.map
                (\dep ->
                    ( dep.name, dependencyInfo dep registry )
                )
            |> Dict.fromList
    , unused = unused
    }


type VersionState
    = UpToDate
    | MajorBehind
    | Upgradable
    | Unknown
