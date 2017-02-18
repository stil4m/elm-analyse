module Analyser.FileContext exposing (FileContext, create)

import AST.Types as AST
import Analyser.Files.Types exposing (Dependency, Interface, LoadedSourceFile, LoadedSourceFiles, FileLoad(Failed, Loaded))
import Analyser.Files.Interface as Interface
import Maybe exposing (Maybe(Just, Nothing))
import Analyser.OperatorTable as OperatorTable
import Analyser.PostProcessing as PostProcessing


type alias FileContext =
    { interface : Interface
    , moduleName : Maybe AST.ModuleName
    , ast : AST.File
    , content : String
    , path : String
    , sha1 : String
    }


create : LoadedSourceFiles -> List Dependency -> LoadedSourceFile -> Maybe FileContext
create sourceFiles dependencies ( fileContent, target ) =
    let
        moduleIndex =
            OperatorTable.buildModuleIndex sourceFiles dependencies
    in
        case target of
            Failed ->
                Nothing

            Loaded l ->
                Just <|
                    let
                        operatorTable =
                            OperatorTable.build l.ast.imports moduleIndex
                    in
                        { moduleName = l.moduleName
                        , ast = PostProcessing.postProcess operatorTable l.ast
                        , path = fileContent.path
                        , content = fileContent.content |> Maybe.withDefault ""
                        , interface = Interface.build l.ast
                        , sha1 = Maybe.withDefault "" fileContent.sha1
                        }
