module Analyser.CodeBase exposing (CodeBase, init, dependencies, setDependencies, sourceFiles, addSourceFiles, mergeLoadedSourceFiles)

import Analyser.Files.Types exposing (Dependency, Version, LoadedSourceFile)
import Dict exposing (Dict)


type CodeBase
    = CodeBase
        { dependencies : List Dependency
        , sources : Dict String LoadedSourceFile
        }


init : CodeBase
init =
    CodeBase
        { dependencies = []
        , sources = Dict.empty
        }


dependencies : CodeBase -> List Dependency
dependencies (CodeBase codeBase) =
    codeBase.dependencies


setDependencies : List Dependency -> CodeBase -> CodeBase
setDependencies deps (CodeBase codeBase) =
    CodeBase { codeBase | dependencies = deps }


sourceFiles : CodeBase -> List LoadedSourceFile
sourceFiles (CodeBase codeBase) =
    Dict.values codeBase.sources


addSourceFiles : List LoadedSourceFile -> CodeBase -> CodeBase
addSourceFiles sourceFiles (CodeBase codeBase) =
    CodeBase { codeBase | sources = mergeLoadedSourceFiles sourceFiles codeBase.sources }


mergeLoadedSourceFiles : List LoadedSourceFile -> Dict String LoadedSourceFile -> Dict String LoadedSourceFile
mergeLoadedSourceFiles newItems dict =
    List.foldl (\sourceFile -> Dict.insert (Tuple.first sourceFile).path sourceFile) dict newItems
