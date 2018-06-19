port module Analyser.DependencyHandler exposing (CacheDependencyRead(..), loadDependencyFiles, loadOnlineDocumentation, onLoadDependencyFilesFromDisk, onOnlineDocumentation, onReadFromDisk, readFromDisk, storeToDisk)

import Analyser.FileContext as FileContext
import Analyser.Files.FileContent as FileContent exposing (FileContent)
import Analyser.Files.Json exposing (deserialiseDependency, serialiseDependency)
import Analyser.Files.Types exposing (LoadedFileData, Version)
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


port storeRawDependency : ( String, Version, String ) -> Cmd msg


port loadRawDependency : ( String, Version ) -> Cmd msg


port onRawDependency : (( String, Version, String ) -> msg) -> Sub msg


storeToDisk : Dependency -> Cmd msg
storeToDisk dependency =
    storeRawDependency
        ( dependency.name
        , dependency.version
        , serialiseDependency dependency
        )


readFromDisk : ( String, Version ) -> Cmd msg
readFromDisk dependency =
    loadRawDependency dependency


type CacheDependencyRead
    = Ignore
    | Failed
    | Success Dependency


onReadFromDisk : ( String, Version ) -> Sub CacheDependencyRead
onReadFromDisk ( n, v ) =
    onRawDependency
        (\( name, version, content ) ->
            if name == n && v == version then
                case deserialiseDependency content of
                    Nothing ->
                        Failed

                    Just d ->
                        Success d
            else
                Ignore
        )



-- Online Docs Ports


port loadHttpDocumentation : ( String, Version ) -> Cmd msg


port onHttpDocumentation : (( ( String, Version ), Value ) -> msg) -> Sub msg


loadOnlineDocumentation : ( String, Version ) -> Cmd msg
loadOnlineDocumentation =
    loadHttpDocumentation


onOnlineDocumentation : ( String, Version ) -> Sub (Maybe (Result String Dependency))
onOnlineDocumentation dep =
    onHttpDocumentation
        (\( d, value ) ->
            if d == dep then
                JD.decodeValue (JD.list Elm.Documentation.decoder) value
                    |> Result.map (depFromModules dep)
                    |> Just
            else
                Nothing
        )


depFromModules : ( String, Version ) -> List Documentation -> Dependency
depFromModules ( depName, version ) docs =
    { name = depName
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


port loadDependencyFiles : ( String, Version ) -> Cmd msg


port onDependencyFiles : (( String, Version, List FileContent ) -> msg) -> Sub msg


onLoadDependencyFilesFromDisk : ( String, Version ) -> Sub (Maybe (Result String Dependency))
onLoadDependencyFilesFromDisk ( name, version ) =
    let
        onRawFiles : ( String, Version, List FileContent ) -> Maybe (Result String Dependency)
        onRawFiles ( n, v, files ) =
            if n == name && v == version then
                let
                    loadedFiles =
                        List.map dependencyFileInterface files
                in
                if not <| List.all Result.isOk loadedFiles then
                    Just (Err "Could not load all dependency files")
                else
                    Just (Ok (buildDependency ( name, version ) loadedFiles))
            else
                Nothing
    in
    onDependencyFiles onRawFiles


buildDependency : ( String, Version ) -> List (Result x LoadedFileData) -> Dependency
buildDependency ( name, version ) loadedFiles =
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
