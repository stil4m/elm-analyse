port module Analyser.DependencyLoader exposing (..)

import AST.Decoding
import AST.Types
import AST.Util as Util
import Analyser.Types exposing (FileContent, FileLoad, LoadedFile, LoadedFileData)
import Interfaces.Interface as Interface
import Json.Decode
import Parser.Parser as Parser
import Result
import Analyser.Dependencies as Dependencies exposing (Version, Dependency)
import Dict


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
    , parsed : List LoadedFile
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
    , loadRawDependency ( name, version )
    )


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
                case Dependencies.deserialise x of
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
                                (withLoaded
                                    >> Maybe.andThen
                                        (\z ->
                                            Util.fileModuleName z.ast
                                                |> Maybe.map (flip (,) z.interface)
                                        )
                                )
                            |> Dict.fromList

                    dependency =
                        (Dependency model.name model.version interfaces)
                in
                    if List.all isLoaded loadedFiles then
                        ( { model | result = Just (Err "Could not load all dependency files") }
                        , Cmd.none
                        )
                    else
                        ( { model | result = Just (Ok dependency) }
                        , storeRawDependency
                            ( dependency.name
                            , dependency.version
                            , Dependencies.serialise dependency
                            )
                        )


isLoaded : FileLoad -> Bool
isLoaded =
    not << (==) Nothing << withLoaded


withLoaded : FileLoad -> Maybe LoadedFileData
withLoaded x =
    case x of
        Analyser.Types.Loaded y ->
            Just y

        _ ->
            Nothing


loadedInterfaceForFile : AST.Types.File -> FileLoad
loadedInterfaceForFile file =
    Analyser.Types.Loaded { ast = file, moduleName = Util.fileModuleName file, interface = Interface.build file }


onInputLoadingInterface : FileContent -> FileLoad
onInputLoadingInterface fileContent =
    fileContent.ast
        |> Maybe.andThen (Json.Decode.decodeString AST.Decoding.decode >> Result.toMaybe)
        |> Maybe.map loadedInterfaceForFile
        |> Maybe.withDefault (loadedFileFromContent fileContent)


loadedFileFromContent : FileContent -> FileLoad
loadedFileFromContent fileContent =
    let
        loadedInterfaceForFile : AST.Types.File -> FileLoad
        loadedInterfaceForFile file =
            Analyser.Types.Loaded { ast = file, moduleName = Util.fileModuleName file, interface = Interface.build file }
    in
        case fileContent.content of
            Just content ->
                (Parser.parse content
                    |> Maybe.map loadedInterfaceForFile
                    |> Maybe.withDefault Analyser.Types.Failed
                )

            Nothing ->
                Analyser.Types.Failed
