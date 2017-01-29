module Analyser.OperatorTable exposing (build, buildModuleIndex)

import AST.Types as AST exposing (Import, InfixDirection, ModuleName, Infix)
import Analyser.LoadedDependencies exposing (LoadedDependencies)
import Analyser.Types exposing (..)
import Dict exposing (..)
import Interfaces.Interface as Interface exposing (Interface)
import Parser.Parser


buildModuleIndex : LoadedSourceFiles -> LoadedDependencies -> ModuleIndex
buildModuleIndex sourceFiles dependencies =
    (++) (sourceFiles |> List.filterMap (Tuple.second >> fromFileLoad))
        (dependencies |> List.concatMap .interfaces |> List.filterMap (Tuple.second >> fromFileLoad))
        |> Dict.fromList


fromFileLoad : Analyser.Types.FileLoad -> Maybe ( ModuleName, Interface )
fromFileLoad fl =
    case fl of
        Analyser.Types.Loaded l ->
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
        AST.InfixExpose s ->
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
