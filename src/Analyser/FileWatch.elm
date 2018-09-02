port module Analyser.FileWatch exposing (FileChange(..), watcher)

import Debug as SafeDebug


port fileWatch : (RawFileChange -> msg) -> Sub msg


type alias RawFileChange =
    { event : String
    , file : String
    }


type FileChange
    = Update String
    | Remove String


watcher : (FileChange -> msg) -> Sub msg
watcher f =
    fileWatch (asFileChange >> f)


asFileChange : RawFileChange -> FileChange
asFileChange p =
    case p.event of
        "update" ->
            Update p.file

        "remove" ->
            Remove p.file

        _ ->
            SafeDebug.crash
                ("Unknown filechange: "
                    ++ toString p
                    ++ "."
                    ++ "This should never happen. Please create an issue the on elm-analyse issue tracker."
                )
