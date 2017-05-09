port module Analyser.Files.DependencyLoader exposing (..)

import Analyser.Files.Types exposing (Version, FileContent, LoadedSourceFile, LoadedFileData)
import Elm.Interface as Interface
import Elm.Dependency exposing (Dependency)
import Analyser.Files.Json exposing (deserialiseDependency, serialiseDependency)
import Json.Decode
import Elm.Parser as Parser
import Result
import Maybe.Extra as Maybe
import Dict
import Util.Logger as Logger
import Result.Extra as Result
import Elm.Json.Decode as Elm
import Elm.RawFile as RawFile exposing (RawFile)


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
        , Logger.info ("Load dependency " ++ name ++ version)
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
                        files
                            |> List.map onInputLoadingInterface

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

                    dependency =
                        Dependency model.name model.version interfaces
                in
                    if not <| List.all Result.isOk loadedFiles then
                        ( { model | result = Just (Err "Could not load all dependency files") }
                        , Cmd.none
                        )
                    else
                        ( { model | result = Just (Ok dependency) }
                        , storeRawDependency
                            ( dependency.name
                            , dependency.version
                            , serialiseDependency dependency
                            )
                        )


loadedInterfaceForFile : RawFile -> Result String LoadedFileData
loadedInterfaceForFile file =
    Ok { ast = file, moduleName = RawFile.moduleName file, interface = Interface.build file }


onInputLoadingInterface : FileContent -> Result String LoadedFileData
onInputLoadingInterface fileContent =
    fileContent.ast
        |> Maybe.andThen (Json.Decode.decodeString Elm.decode >> Result.toMaybe)
        |> Maybe.map loadedInterfaceForFile
        |> Maybe.orElseLazy (\() -> Just (loadedFileFromContent fileContent))
        |> Maybe.withDefault (Err "Internal problem in the file loader. Please report an issue.")


loadedFileFromContent : FileContent -> Result String LoadedFileData
loadedFileFromContent fileContent =
    let
        loadedInterfaceForFile : RawFile -> Result String LoadedFileData
        loadedInterfaceForFile file =
            Ok { ast = file, moduleName = RawFile.moduleName file, interface = Interface.build file }
    in
        case fileContent.content of
            Just content ->
                (Parser.parse content
                    |> Result.map loadedInterfaceForFile
                    |> Result.mapError (List.head >> Maybe.withDefault "" >> Err)
                    |> Result.merge
                )

            Nothing ->
                Err "No file content"
