module Analyser.FileContext exposing (FileContext, create)

import AST.Types as AST
import Analyser.LoadedDependencies exposing (LoadedDependencies)
import Analyser.Types exposing (LoadedSourceFile, LoadedSourceFiles)
import Interfaces.Interface exposing (Interface)
import Maybe exposing (Maybe(Just, Nothing))
import Analyser.OperatorTable as OperatorTable
import Analyser.Types exposing (LoadedSourceFiles, LoadedSourceFile)
import Analyser.PostProcessing as PostProcessing


type alias FileContext =
    { interface : Interface
    , moduleName : Maybe AST.ModuleName
    , ast : AST.File
    , content : String
    , path : String
    }


create : LoadedSourceFiles -> LoadedDependencies -> LoadedSourceFile -> Maybe FileContext
create sourceFiles dependencies ( fileContent, target ) =
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
                        , ast = PostProcessing.postProcess operatorTable l.ast
                        , path = fileContent.path
                        , content = fileContent.content |> Maybe.withDefault ""
                        , interface = Interfaces.Interface.build l.ast
                        }
