module Analyser.SourceLoadingStage exposing (init, update, isDone, parsedFiles, Model, Msg, subscriptions)

import AST.Types
import AST.Util as Util
import Analyser.Types exposing (FileContent, FileLoad, LoadedFile)
import AnalyserPorts
import Interfaces.Interface as Interface
import List.Extra
import Parser.Parser as Parser
import AST.Encoding
import Json.Encode


type Model
    = Model State


type Msg
    = OnFileContent FileContent


type alias State =
    { filesToLoad : Maybe ( String, List String )
    , parsedFiles : List LoadedFile
    }


init : List String -> ( Model, Cmd Msg )
init input =
    ( Model
        { filesToLoad = List.Extra.uncons input
        , parsedFiles = []
        }
    , Cmd.none
    )
        |> loadNextFile


isDone : Model -> Bool
isDone (Model model) =
    model.filesToLoad == Nothing


parsedFiles : Model -> Analyser.Types.LoadedSourceFiles
parsedFiles (Model model) =
    model.parsedFiles


update : Msg -> Model -> ( Model, Cmd Msg )
update msg (Model state) =
    case msg of
        OnFileContent fileContent ->
            state.filesToLoad
                |> Maybe.map
                    (\( _, rest ) ->
                        let
                            newFileContent =
                                onInputLoadingInterface fileContent
                        in
                            ( Model
                                { state
                                    | filesToLoad = List.Extra.uncons rest
                                    , parsedFiles = newFileContent :: state.parsedFiles
                                }
                            , case (Tuple.first newFileContent).sha1 of
                                Nothing ->
                                    Cmd.none

                                Just sha1 ->
                                    case (Tuple.second newFileContent) of
                                        Analyser.Types.Loaded x ->
                                            AnalyserPorts.storeAstForSha ( sha1, (Json.Encode.encode 0 (AST.Encoding.encode x.ast)) )

                                        _ ->
                                            Cmd.none
                            )
                    )
                |> Maybe.map loadNextFile
                |> Maybe.withDefault (Model state ! [])


onInputLoadingInterface : FileContent -> LoadedFile
onInputLoadingInterface fileContent =
    let
        loadedInterfaceForFile : AST.Types.File -> FileLoad
        loadedInterfaceForFile file =
            Analyser.Types.Loaded { ast = file, moduleName = Util.fileModuleName file, interface = Interface.build file }
    in
        case fileContent.content of
            Just content ->
                ( fileContent
                , Parser.parse content
                    |> Maybe.map loadedInterfaceForFile
                    |> Maybe.withDefault Analyser.Types.Failed
                )

            Nothing ->
                ( fileContent
                , Analyser.Types.Failed
                )


loadNextFile : ( Model, Cmd Msg ) -> ( Model, Cmd Msg )
loadNextFile ( Model model, msgs ) =
    model.filesToLoad
        |> Maybe.map
            (\( next, _ ) ->
                ( Model model
                , Cmd.batch [ msgs, AnalyserPorts.loadFile next ]
                )
            )
        |> Maybe.withDefault ( Model model, msgs )


subscriptions : Model -> Sub Msg
subscriptions _ =
    AnalyserPorts.fileContent OnFileContent
