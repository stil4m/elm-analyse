port module Analyser.FileWatch exposing (FileChange(Remove, Update), Person, watcher)

import Debug as SafeDebug


port fileWatch : (( String, String ) -> msg) -> Sub msg


type alias Person =
    { name : String
    , age : Int
    }


type FileChange
    = Update String
    | Remove String


watcher : (FileChange -> msg) -> Sub msg
watcher f =
    fileWatch (asFileChange >> f)


asFileChange : ( String, String ) -> FileChange
asFileChange p =
    case p of
        ( "update", x ) ->
            Update x

        ( "remove", x ) ->
            Remove x

        _ ->
            SafeDebug.crash
                ("Unknown filechange: "
                    ++ toString p
                    ++ "."
                    ++ "This should never happen. Please create an issue the on elm-analyse issue tracker."
                )
