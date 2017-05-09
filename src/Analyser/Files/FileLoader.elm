port module Analyser.Files.FileLoader exposing (Msg, init, subscriptions, update)

import Elm.RawFile exposing (RawFile)
import Elm.Json.Encode
import Elm.Json.Decode as Elm
import Analyser.Files.Types exposing (LoadedSourceFile, FileContent, LoadedFileData)
import Json.Encode
import Json.Decode
import Elm.Parser as Parser
import Result
import Maybe.Extra as Maybe
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


update : Msg -> ( LoadedSourceFile, Cmd a )
update msg =
    case msg of
        OnFileContent fileContent ->
            let
                ( fileLoad, store ) =
                    onInputLoadingInterface fileContent

                cmd =
                    if store then
                        ( fileContent.sha1, Result.toMaybe fileLoad )
                            |> uncurry (Maybe.map2 (\a b -> storeAstForSha ( a, Json.Encode.encode 0 (Elm.Json.Encode.encode b) )))
                            |> Maybe.withDefault Cmd.none
                    else
                        Cmd.none
            in
                ( ( fileContent, fileLoad ), cmd )


onInputLoadingInterface : FileContent -> ( Result String RawFile, RefeshedAST )
onInputLoadingInterface fileContent =
    fileContent.ast
        |> Maybe.andThen (Json.Decode.decodeString Elm.decode >> Result.toMaybe)
        |> Maybe.map Ok
        |> Maybe.map (flip (,) False)
        |> Maybe.orElseLazy (\() -> Just ( loadedFileFromContent fileContent, True ))
        |> Maybe.withDefault ( Err "Internal problem in the file loader. Please report an issue.", False )


loadedFileFromContent : FileContent -> Result String RawFile
loadedFileFromContent fileContent =
    case fileContent.content of
        Just content ->
            (Parser.parse content
                |> Result.map Ok
                |> Result.mapError (List.head >> Maybe.withDefault "" >> Err)
                |> Result.merge
            )

        Nothing ->
            Err "No file content"
