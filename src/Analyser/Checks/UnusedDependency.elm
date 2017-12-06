module Analyser.Checks.UnusedDependency exposing (check)

import Analyser.CodeBase as CodeBase exposing (CodeBase)
import Analyser.FileContext exposing (FileContext)
import Dict
import Elm.Dependency exposing (Dependency)
import Elm.Syntax.Base exposing (ModuleName)
import Elm.Syntax.Module exposing (Import)


check : CodeBase -> List FileContext -> List Dependency
check codeBase files =
    List.foldl filterUsedDeps (CodeBase.dependencies codeBase) files


filterUsedDeps : FileContext -> List Dependency -> List Dependency
filterUsedDeps { ast } deps =
    List.foldl markImport deps ast.imports


markImport : Import -> List Dependency -> List Dependency
markImport { moduleName } deps =
    List.filter (not << dependencyIncludesModule moduleName) deps


dependencyIncludesModule : ModuleName -> Dependency -> Bool
dependencyIncludesModule moduleName dependency =
    Dict.member moduleName dependency.interfaces
