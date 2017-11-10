module Analyser.State.Dependencies exposing (..)

import Dict exposing (Dict)
import Elm.Dependency exposing (Dependency)
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
    , versionState = Debug.crash ""
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
