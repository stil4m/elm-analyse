module Analyser.CodeBase exposing (CodeBase, init, dependencies, setDependencies, sourceFiles, addSourceFiles, mergeLoadedSourceFiles, processContext)

import Analyser.Files.Types exposing (LoadedSourceFile)
import Dict exposing (Dict)
import Elm.Dependency exposing (Dependency)
import Elm.Processing as Processing exposing (ProcessContext)


type CodeBase
    = CodeBase
        { dependencies : List Dependency
        , sources : Dict String LoadedSourceFile
        , processContext : ProcessContext
        }


init : CodeBase
init =
    CodeBase
        { dependencies = []
        , sources = Dict.empty
        , processContext = Processing.init
        }


processContext : CodeBase -> ProcessContext
processContext (CodeBase codeBase) =
    codeBase.processContext


dependencies : CodeBase -> List Dependency
dependencies (CodeBase codeBase) =
    codeBase.dependencies


setDependencies : List Dependency -> CodeBase -> CodeBase
setDependencies deps (CodeBase codeBase) =
    CodeBase
        { codeBase
            | dependencies = deps
            , processContext = List.foldl Processing.addDependency codeBase.processContext deps
        }


sourceFiles : CodeBase -> List LoadedSourceFile
sourceFiles (CodeBase codeBase) =
    Dict.values codeBase.sources


addSourceFiles : List LoadedSourceFile -> CodeBase -> CodeBase
addSourceFiles sourceFiles (CodeBase codeBase) =
    CodeBase
        { codeBase
            | sources = mergeLoadedSourceFiles sourceFiles codeBase.sources
            , processContext =
                List.foldl Processing.addFile
                    codeBase.processContext
                    (List.filterMap (Tuple.second >> Result.toMaybe) sourceFiles)
        }


mergeLoadedSourceFiles : List LoadedSourceFile -> Dict String LoadedSourceFile -> Dict String LoadedSourceFile
mergeLoadedSourceFiles newItems dict =
    List.foldl (\sourceFile -> Dict.insert (Tuple.first sourceFile).path sourceFile) dict newItems
