port module Analyser.Files.FileLoader exposing (Msg, init, load, subscriptions, update)

import Analyser.Files.FileContent as FileContent exposing (FileContent)
import Analyser.Files.Types exposing (LoadedSourceFile)
import Elm.RawFile
import Json.Encode exposing (Value)
import Result
import Util.Logger as Logger


port loadFile : String -> Cmd msg


port fileContent : (FileContent -> msg) -> Sub msg


port storeAstForSha : AstStore -> Cmd msg


type alias AstStore =
    { sha1 : String
    , ast : Value
    }


type Msg
    = OnFileContent FileContent


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
        OnFileContent fc ->
            load fc


load : FileContent -> ( LoadedSourceFile, Cmd a )
load fc =
    let
        ( fileLoad, store ) =
            FileContent.asRawFile fc

        cmd : Cmd a
        cmd =
            if store then
                fileLoad
                    |> Result.toMaybe
                    |> Maybe.map Elm.RawFile.encode
                    |> Maybe.map2 AstStore fc.sha1
                    |> Maybe.map storeAstForSha
                    |> Maybe.withDefault Cmd.none

            else
                Cmd.none
    in
    ( ( fc, fileLoad )
    , cmd
    )
