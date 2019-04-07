module Analyser.Checks.UnusedDependency exposing (check)

import Analyser.CodeBase as CodeBase exposing (CodeBase)
import Analyser.FileContext exposing (FileContext)
import Dict
import Elm.Dependency exposing (Dependency)
import Elm.Syntax.Import exposing (Import)
import Elm.Syntax.ModuleName exposing (ModuleName)
import Elm.Syntax.Node exposing (Node(..))


check : CodeBase -> List FileContext -> List Dependency
check codeBase files =
    List.foldl filterUsedDeps (CodeBase.dependencies codeBase) files
        |> List.filter notElmLangCore


notElmLangCore : Dependency -> Bool
notElmLangCore dep =
    dep.name /= "elm/core"


filterUsedDeps : FileContext -> List Dependency -> List Dependency
filterUsedDeps { ast } deps =
    List.foldl markImport deps ast.imports


markImport : Node Import -> List Dependency -> List Dependency
markImport (Node _ { moduleName }) deps =
    List.filter (not << dependencyIncludesModule moduleName) deps


dependencyIncludesModule : Node ModuleName -> Dependency -> Bool
dependencyIncludesModule (Node _ moduleName) dependency =
    Dict.member moduleName dependency.interfaces
