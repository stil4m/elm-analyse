port module Analyser.Files.FileLoader exposing (Msg, init, subscriptions, update)

import AST.Types
import AST.Util as Util
import AST.Encoding
import AST.Decoding
import Analyser.Files.Types exposing (FileContent, FileLoad(Loaded, Failed), LoadedFile, LoadedFileData)
import Analyser.Files.Interface as Interface
import Json.Encode
import Json.Decode
import Parser.Parser as Parser
import Result
import Maybe.Extra as Maybe
import Analyser.Files.Util
import Util.Logger as Logger
import Result.Extra as Result


port loadFile : String -> Cmd msg


port fileContent : (FileContent -> msg) -> Sub msg


port storeAstForSha : ( String, String ) -> Cmd msg


type Msg
    = OnFileContent FileContent


type alias RefeshedAST =
    Bool


init : String -> Cmd Msg
init s =
    Cmd.batch
        [ loadFile s
        , Logger.info ("Load file " ++ s ++ "...")
        ]


subscriptions : Sub Msg
subscriptions =
    fileContent OnFileContent


update : Msg -> ( LoadedFile, Cmd a )
update msg =
    case msg of
        OnFileContent fileContent ->
            let
                ( fileLoad, store ) =
                    onInputLoadingInterface fileContent

                cmd =
                    if store then
                        ( fileContent.sha1, Analyser.Files.Util.withLoaded fileLoad )
                            |> uncurry (Maybe.map2 (\a b -> storeAstForSha ( a, Json.Encode.encode 0 (AST.Encoding.encode b.ast) )))
                            |> Maybe.withDefault Cmd.none
                    else
                        Cmd.none
            in
                ( ( fileContent, fileLoad ), cmd )


loadedInterfaceForFile : AST.Types.File -> FileLoad
loadedInterfaceForFile file =
    Loaded { ast = file, moduleName = Util.fileModuleName file, interface = Interface.build file }


onInputLoadingInterface : FileContent -> ( FileLoad, RefeshedAST )
onInputLoadingInterface fileContent =
    fileContent.ast
        |> Maybe.andThen (Json.Decode.decodeString AST.Decoding.decode >> Result.toMaybe)
        |> Maybe.map loadedInterfaceForFile
        |> Maybe.map (flip (,) False)
        |> Maybe.orElseLazy (\() -> Just ( loadedFileFromContent fileContent, True ))
        |> Maybe.withDefault ( Failed "Internal problem in the file loader. Please report an issue.", False )


loadedFileFromContent : FileContent -> FileLoad
loadedFileFromContent fileContent =
    let
        loadedInterfaceForFile : AST.Types.File -> FileLoad
        loadedInterfaceForFile file =
            Loaded { ast = file, moduleName = Util.fileModuleName file, interface = Interface.build file }
    in
        case fileContent.content of
            Just content ->
                (Parser.parse content
                    |> Result.map loadedInterfaceForFile
                    |> Result.mapError (List.head >> Maybe.withDefault "" >> Failed)
                    |> Result.merge
                )

            Nothing ->
                Failed "No file content"
