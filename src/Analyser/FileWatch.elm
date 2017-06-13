port module Analyser.FileWatch exposing (watcher, FileChange(Remove, Update))


port fileWatch : (( String, String ) -> msg) -> Sub msg


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
            Update x

        _ ->
            Debug.crash
                ("Unknown filechange: "
                    ++ toString p
                    ++ "."
                    ++ "This should never happen. Please create an issue the on elm-analyse issue tracker."
                )
