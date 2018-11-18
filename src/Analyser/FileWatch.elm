port module Analyser.FileWatch exposing (FileChange(..), watcher)


port fileWatch : (RawFileChange -> msg) -> Sub msg


type alias RawFileChange =
    { event : String
    , file : String
    }


type FileChange
    = Update String
    | Remove String


watcher : (Maybe FileChange -> msg) -> Sub msg
watcher f =
    fileWatch (asFileChange >> f)


asFileChange : RawFileChange -> Maybe FileChange
asFileChange p =
    case p.event of
        "update" ->
            Just <| Update p.file

        "remove" ->
            Just <| Remove p.file

        _ ->
            Nothing
