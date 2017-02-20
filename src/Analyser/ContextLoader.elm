port module Analyser.ContextLoader exposing (Context, emptyContext, loadContext, onLoadedContext)

import Analyser.Files.Types exposing (Dependency, Version)


type alias Context =
    { interfaceFiles : List ( String, Version )
    , sourceFiles : List String
    }


port loadContext : () -> Cmd msg


port onLoadedContext : (Context -> msg) -> Sub msg


emptyContext : Context
emptyContext =
    { interfaceFiles = [], sourceFiles = [] }
