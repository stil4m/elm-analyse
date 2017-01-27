module Analyser.Types exposing (..)

import AST.Types as AST
import Interfaces.Interface as Interface
import Dict exposing (Dict)


type alias LoadedSourceFiles =
    List LoadedSourceFile


type alias LoadedSourceFile =
    ( String, FileLoad )


type FileLoad
    = Failed
    | Loaded
        { interface : Interface.Interface
        , moduleName : Maybe AST.ModuleName
        , ast : AST.File
        }


type alias ModuleIndex =
    Dict AST.ModuleName Interface.Interface


type alias OperatorTable =
    Dict String AST.Infix
