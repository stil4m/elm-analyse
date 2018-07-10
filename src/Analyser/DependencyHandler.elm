port module Analyser.DependencyHandler exposing (CacheDependencyRead(..), DependencyPointer, loadDependencyFiles, loadOnlineDocumentation, onLoadDependencyFilesFromDisk, onOnlineDocumentation, onReadFromDisk, readFromDisk, storeToDisk)

import Analyser.FileContext as FileContext
import Analyser.Files.FileContent as FileContent exposing (FileContent)
import Analyser.Files.Json exposing (deserialiseDependencyValue, serialiseDependency)
import Analyser.Files.Types exposing (LoadedFileData)
import Dict
import Elm.Dependency exposing (Dependency)
import Elm.Documentation exposing (Documentation)
import Elm.Interface as Interface exposing (Interface)
import Elm.RawFile exposing (RawFile)
import Elm.Syntax.Base exposing (ModuleName)
import Elm.Syntax.Infix
import Json.Decode as JD exposing (Value)
import Result.Extra as Result


--- Cached Dependencies


type alias DependencyPointer =
    { name : String
    , version : String
    }


type alias DependencyStore =
    { dependency : DependencyPointer
    , content : String
    }


type alias RawDependencyLoad =
    { dependency : DependencyPointer
    , json : Value
    }


type alias DependencyFiles =
    { dependency : DependencyPointer
    , files : List FileContent
    }


type alias HttpDocumentationLoad =
    { dependency : DependencyPointer
    , json : Value
    }


port storeRawDependency : DependencyStore -> Cmd msg


port loadRawDependency : DependencyPointer -> Cmd msg


port onRawDependency : (RawDependencyLoad -> msg) -> Sub msg


storeToDisk : Dependency -> Cmd msg
storeToDisk dependency =
    storeRawDependency
        { dependency = { name = dependency.name, version = dependency.version }
        , content = serialiseDependency dependency
        }


readFromDisk : DependencyPointer -> Cmd msg
readFromDisk dependency =
    loadRawDependency dependency


type CacheDependencyRead
    = Ignore
    | Failed
    | Success Dependency


onReadFromDisk : DependencyPointer -> Sub CacheDependencyRead
onReadFromDisk { name, version } =
    onRawDependency
        (\{ dependency, json } ->
            if dependency.name == name && version == dependency.version then
                case deserialiseDependencyValue json of
                    Nothing ->
                        Failed

                    Just d ->
                        Success d
            else
                Ignore
        )



-- Online Docs Ports


port loadHttpDocumentation : DependencyPointer -> Cmd msg


port onHttpDocumentation : (HttpDocumentationLoad -> msg) -> Sub msg


loadOnlineDocumentation : DependencyPointer -> Cmd msg
loadOnlineDocumentation =
    loadHttpDocumentation


onOnlineDocumentation : DependencyPointer -> Sub (Maybe (Result String Dependency))
onOnlineDocumentation dep =
    onHttpDocumentation
        (\{ dependency, json } ->
            if dependency == dep then
                JD.decodeValue (JD.list Elm.Documentation.decoder) json
                    |> Result.map (depFromModules dep)
                    |> Just
            else
                Nothing
        )


depFromModules : DependencyPointer -> List Documentation -> Dependency
depFromModules { name, version } docs =
    { name = name
    , version = version
    , interfaces = Dict.fromList (List.map interfaceFromDocumentation docs)
    }


interfaceFromDocumentation : Documentation -> ( ModuleName, Interface )
interfaceFromDocumentation doc =
    ( String.split "." doc.name
    , List.concat
        [ doc.aliases |> List.map (.name >> Interface.Alias)
        , doc.unions |> List.map (\t -> Interface.Type ( t.name, List.map Tuple.first t.tags ))
        , doc.values
            |> List.map
                (\value ->
                    case value.name of
                        Elm.Documentation.Name s ->
                            Interface.Function s

                        Elm.Documentation.Op str ass prec ->
                            Interface.Operator
                                { direction =
                                    case ass of
                                        Elm.Documentation.Left ->
                                            Elm.Syntax.Infix.Left

                                        Elm.Documentation.Right ->
                                            Elm.Syntax.Infix.Right

                                        Elm.Documentation.None ->
                                            Elm.Syntax.Infix.Left
                                , precedence = prec
                                , operator = str
                                }
                )
        ]
    )



-- Dep File Loading Ports


port loadDependencyFiles : DependencyPointer -> Cmd msg


port onDependencyFiles : (DependencyFiles -> msg) -> Sub msg


onLoadDependencyFilesFromDisk : DependencyPointer -> Sub (Maybe (Result String Dependency))
onLoadDependencyFilesFromDisk dep =
    let
        onRawFiles : DependencyFiles -> Maybe (Result String Dependency)
        onRawFiles { dependency, files } =
            if dep == dependency then
                let
                    loadedFiles =
                        List.map dependencyFileInterface files
                in
                if not <| List.all Result.isOk loadedFiles then
                    Just (Err "Could not load all dependency files")
                else
                    Just (Ok (buildDependency dependency loadedFiles))
            else
                Nothing
    in
    onDependencyFiles onRawFiles


buildDependency : DependencyPointer -> List (Result x LoadedFileData) -> Dependency
buildDependency { name, version } loadedFiles =
    loadedFiles
        |> List.filterMap
            (Result.toMaybe
                >> Maybe.map (\z -> ( FileContext.moduleName z.ast, z.interface ))
            )
        |> Dict.fromList
        |> Dependency name version


dependencyFileInterface : FileContent -> Result String LoadedFileData
dependencyFileInterface =
    FileContent.asRawFile >> Tuple.first >> Result.map loadedInterfaceForFile


loadedInterfaceForFile : RawFile -> LoadedFileData
loadedInterfaceForFile file =
    { ast = file, moduleName = FileContext.moduleName file, interface = Interface.build file }
