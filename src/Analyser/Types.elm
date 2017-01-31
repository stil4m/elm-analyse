module Analyser.Types
    exposing
        ( LoadedSourceFiles
        , LoadedSourceFile
        , FileLoad(Failed, Loaded)
        , LoadedFile
        , ModuleIndex
        , OperatorTable
        , FileContent
        )

import AST.Types as AST
import Interfaces.Interface as Interface
import Dict exposing (Dict)


type alias LoadedSourceFiles =
    List LoadedSourceFile


type alias LoadedSourceFile =
    ( FileContent, FileLoad )


type alias LoadedFile =
    ( FileContent, FileLoad )


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


type alias FileContent =
    { path : String
    , success : Bool
    , sha1 : Maybe String
    , content : Maybe String
    , formatted : Bool
    }
