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


port loadFile : String -> Cmd msg


port fileContent : (FileContent -> msg) -> Sub msg


port storeAstForSha : ( String, String ) -> Cmd msg


type Msg
    = OnFileContent FileContent


type alias RefeshedAST =
    Bool


init : String -> Cmd Msg
init s =
    loadFile s


subscriptions : Sub Msg
subscriptions =
    fileContent OnFileContent


isLoaded : FileLoad -> Maybe LoadedFileData
isLoaded x =
    case x of
        Loaded y ->
            Just y

        _ ->
            Nothing


update : Msg -> ( LoadedFile, Cmd a )
update msg =
    case msg of
        OnFileContent fileContent ->
            let
                ( fileLoad, store ) =
                    onInputLoadingInterface fileContent

                cmd =
                    if store then
                        ( fileContent.sha1, isLoaded fileLoad )
                            |> uncurry (Maybe.map2 (\a b -> storeAstForSha ( a, Json.Encode.encode 0 (AST.Encoding.encode b.ast) )))
                            |> Maybe.withDefault (Cmd.none)
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
        |> Maybe.withDefault ( loadedFileFromContent fileContent, True )


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
                    |> Maybe.map loadedInterfaceForFile
                    |> Maybe.withDefault Failed
                )

            Nothing ->
                Failed
