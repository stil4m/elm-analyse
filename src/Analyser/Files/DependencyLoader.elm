port module Analyser.Files.DependencyLoader exposing (..)

import Analyser.Files.FileContent as FileContent exposing (FileContent)
import Analyser.Files.Json exposing (deserialiseDependency, serialiseDependency)
import Analyser.Files.Types exposing (LoadedFileData, LoadedSourceFile, Version)
import Dict
import Elm.Dependency exposing (Dependency)
import Elm.Interface as Interface
import Elm.RawFile as RawFile exposing (RawFile)
import Result
import Result.Extra as Result
import Util.Logger as Logger


port loadRawDependency : ( String, Version ) -> Cmd msg


port loadDependencyFiles : ( String, Version ) -> Cmd msg


port storeRawDependency : ( String, Version, String ) -> Cmd msg


port onRawDependency : (( String, Version, String ) -> msg) -> Sub msg


port onDependencyFiles : (( String, Version, List FileContent ) -> msg) -> Sub msg


type Msg
    = LoadedRawDependency ( String, Version, String )
    | LoadedDependencyFiles ( String, Version, List FileContent )


type alias RefeshedAST =
    Bool


type alias Model =
    { name : String
    , version : Version
    , toParse : List String
    , parsed : List LoadedSourceFile
    , result : Maybe (Result String Dependency)
    }


init : ( String, Version ) -> ( Model, Cmd Msg )
init ( name, version ) =
    ( { name = name
      , version = version
      , toParse = []
      , parsed = []
      , result = Nothing
      }
    , Cmd.batch
        [ loadRawDependency ( name, version )
        , Logger.info ("Load dependency " ++ name ++ " " ++ version)
        ]
    )


getDependency : Model -> ( String, Version )
getDependency m =
    ( m.name, m.version )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ onRawDependency LoadedRawDependency
        , onDependencyFiles LoadedDependencyFiles
        ]


getResult : Model -> Maybe (Result String Dependency)
getResult =
    .result


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        LoadedRawDependency ( dep, ver, x ) ->
            if model.name /= dep || model.version /= ver then
                ( model, Cmd.none )
            else
                case deserialiseDependency x of
                    Nothing ->
                        ( model, loadDependencyFiles ( model.name, model.version ) )

                    Just dependency ->
                        ( { model | result = Just (Ok dependency) }, Cmd.none )

        LoadedDependencyFiles ( dep, ver, files ) ->
            if model.name /= dep || model.version /= ver then
                ( model, Cmd.none )
            else
                let
                    loadedFiles =
                        List.map dependencyFileInterface files
                in
                if not <| List.all Result.isOk loadedFiles then
                    ( { model | result = Just (Err "Could not load all dependency files") }
                    , Cmd.none
                    )
                else
                    let
                        dependency =
                            buildDependency model loadedFiles
                    in
                    ( { model | result = Just (Ok dependency) }
                    , storeRawDependency
                        ( dependency.name
                        , dependency.version
                        , serialiseDependency dependency
                        )
                    )


buildDependency : Model -> List (Result x LoadedFileData) -> Dependency
buildDependency model loadedFiles =
    let
        interfaces =
            loadedFiles
                |> List.filterMap
                    (Result.toMaybe
                        >> Maybe.andThen
                            (\z ->
                                RawFile.moduleName z.ast
                                    |> Maybe.map (flip (,) z.interface)
                            )
                    )
                |> Dict.fromList
    in
    Dependency model.name model.version interfaces


dependencyFileInterface : FileContent -> Result String LoadedFileData
dependencyFileInterface =
    FileContent.asRawFile >> Tuple.first >> Result.map loadedInterfaceForFile


loadedInterfaceForFile : RawFile -> LoadedFileData
loadedInterfaceForFile file =
    { ast = file, moduleName = RawFile.moduleName file, interface = Interface.build file }
