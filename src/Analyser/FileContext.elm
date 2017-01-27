module Analyser.FileContext exposing (..)

import AST.Types as AST
import Analyser.LoadedDependencies exposing (LoadedDependencies)
import Analyser.Types exposing (LoadedSourceFile, LoadedSourceFiles)
import Dict exposing (Dict)
import Interfaces.Interface exposing (Interface)
import Maybe exposing (Maybe(Just, Nothing))
import Analyser.OperatorTable as OperatorTable
import Analyser.Types exposing (..)
import Analyser.PostProcessing as PostProcessing


type alias FileContext =
    { moduleName : Maybe AST.ModuleName
    , ast : AST.File
    , path : String
    }


create : LoadedSourceFiles -> LoadedDependencies -> LoadedSourceFile -> Maybe FileContext
create sourceFiles dependencies ( path, target ) =
    let
        moduleIndex =
            OperatorTable.buildModuleIndex sourceFiles dependencies
    in
        case target of
            Analyser.Types.Failed ->
                Nothing

            Analyser.Types.Loaded l ->
                Just <|
                    let
                        operatorTable =
                            OperatorTable.build l.ast.imports moduleIndex
                    in
                        { moduleName = l.moduleName
                        , ast = l.ast |> PostProcessing.postProcess operatorTable
                        , path = path
                        }


collectInterfaces : ModuleIndex -> AST.File -> List Interface
collectInterfaces moduleIndex file =
    file.imports |> List.filterMap (collectInterfaceForImport moduleIndex)


collectInterfaceForImport : ModuleIndex -> AST.Import -> Maybe Interface
collectInterfaceForImport moduleIndex imp =
    Dict.get (Debug.log "Interfaces" imp.moduleName)
        moduleIndex
