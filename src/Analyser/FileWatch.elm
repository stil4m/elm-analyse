port module Analyser.FileWatch exposing (FileChange(..), watcher)

import Analyser.Files.FileContent exposing (FileContent)


port fileWatch : (RawFileChange -> msg) -> Sub msg


type alias RawFileChange =
    { event : String
    , file : String
    , content : Maybe String
    }


type FileChange
    = Update String (Maybe FileContent)
    | Remove String


watcher : (Maybe FileChange -> msg) -> Sub msg
watcher f =
    fileWatch (asFileChange >> f)


asFileContent : RawFileChange -> String -> FileContent
asFileContent p content =
    { path = p.file
    , success = True
    , sha1 = Nothing
    , content = Just content
    , ast = Nothing
    }


asFileChange : RawFileChange -> Maybe FileChange
asFileChange p =
    case p.event of
        "update" ->
            Just <| Update p.file (Maybe.map (asFileContent p) p.content)

        "remove" ->
            Just <| Remove p.file

        _ ->
            Nothing
