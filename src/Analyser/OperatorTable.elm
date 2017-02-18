module Analyser.OperatorTable exposing (build, buildModuleIndex)

import AST.Types as AST exposing (Import, InfixDirection, ModuleName, Infix)
import Analyser.Files.Types exposing (Dependency, Interface, FileLoad(Loaded), LoadedSourceFiles, LoadedSourceFile, ModuleIndex, OperatorTable)
import Analyser.Files.Interface as Interface
import Dict exposing (Dict)
import Parser.Parser


buildModuleIndex : LoadedSourceFiles -> List Dependency -> ModuleIndex
buildModuleIndex sourceFiles dependencies =
    List.filterMap (Tuple.second >> fromFileLoad) sourceFiles
        ++ (dependencies |> List.concatMap (.interfaces >> Dict.toList))
        |> Dict.fromList


fromFileLoad : FileLoad -> Maybe ( ModuleName, Interface )
fromFileLoad fl =
    case fl of
        Loaded l ->
            l.moduleName |> Maybe.map (flip (,) l.interface)

        _ ->
            Nothing


build : List Import -> ModuleIndex -> OperatorTable
build imports moduleIndex =
    List.concatMap (flip buildSingle moduleIndex) (defaultImports ++ imports)
        |> Dict.fromList


buildSingle : Import -> ModuleIndex -> List ( String, Infix )
buildSingle imp moduleIndex =
    case imp.exposingList of
        AST.None ->
            []

        AST.All _ ->
            moduleIndex
                |> Dict.get imp.moduleName
                |> Maybe.withDefault []
                |> Interface.getOperators
                |> List.map (\x -> ( x.operator, x ))

        AST.Explicit l ->
            let
                selectedOperators =
                    List.filterMap getExposedOperators l
            in
                moduleIndex
                    |> Dict.get imp.moduleName
                    |> Maybe.withDefault []
                    |> Interface.getOperators
                    |> List.map (\x -> ( x.operator, x ))
                    |> List.filter (Tuple.first >> flip List.member selectedOperators)


getExposedOperators : AST.Expose -> Maybe String
getExposedOperators x =
    case x of
        AST.InfixExpose s _ ->
            Just s

        _ ->
            Nothing


defaultImportString : String
defaultImportString =
    """
import Basics exposing (..)
import List exposing ( List, (::) )
import Maybe exposing ( Maybe( Just, Nothing ) )
import Result exposing ( Result( Ok, Err ) )
import String
import Tuple

import Debug

import Platform exposing ( Program )
import Platform.Cmd exposing ( Cmd, (!) )
import Platform.Sub exposing ( Sub )
"""


defaultImports : List AST.Import
defaultImports =
    Parser.Parser.parse defaultImportString
        |> Maybe.map .imports
        |> Maybe.withDefault []
