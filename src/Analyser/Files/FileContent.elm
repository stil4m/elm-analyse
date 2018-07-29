module Analyser.Files.FileContent exposing (FileContent, RefeshedAST, asFileRef, asRawFile)

import Analyser.FileRef exposing (FileRef)
import Elm.Json.Decode as Elm
import Elm.Parser as Parser
import Elm.RawFile exposing (RawFile)
import Json.Decode
import Maybe.Extra as Maybe
import Result.Extra as Result


type alias RefeshedAST =
    Bool


asFileRef : FileContent -> FileRef
asFileRef x =
    { path = x.path, version = x.sha1 |> Maybe.withDefault "" }


type alias FileContent =
    { path : String
    , success : Bool
    , sha1 : Maybe String
    , content : Maybe String
    , ast : Maybe String
    }


asRawFile : FileContent -> ( Result String RawFile, RefeshedAST )
asRawFile fileContent =
    fileContent.ast
        |> Maybe.andThen (Json.Decode.decodeString Elm.decode >> Result.toMaybe)
        |> Maybe.map (\x -> ( Ok x, False ))
        |> Maybe.orElseLazy (\() -> Just ( loadedFileFromContent fileContent, True ))
        |> Maybe.withDefault ( Err "Internal problem in the file loader. Please report an issue.", False )


loadedFileFromContent : FileContent -> Result String RawFile
loadedFileFromContent fileContent =
    case fileContent.content of
        Just content ->
            Parser.parse content
                |> Result.map Ok
                |> Result.mapError (List.head >> Maybe.withDefault "" >> Err)
                |> Result.merge

        Nothing ->
            Err "No file content"
