module Analyser.Files.Types exposing
    ( LoadedFileData
    , LoadedSourceFile
    , LoadedSourceFiles
    , ModuleIndex
    , OperatorTable
    , Version
    )

import Analyser.Files.FileContent exposing (FileContent)
import Dict exposing (Dict)
import Elm.Interface exposing (Interface)
import Elm.RawFile exposing (RawFile)
import Elm.Syntax.Infix as AST
import Elm.Syntax.ModuleName exposing (ModuleName)
import Parser exposing (DeadEnd)


type alias Version =
    String


type alias LoadedSourceFiles =
    List LoadedSourceFile


type alias LoadedSourceFile =
    ( FileContent, Result (List DeadEnd) RawFile )


type alias LoadedFileData =
    { interface : Interface
    , moduleName : ModuleName
    , ast : RawFile
    }


type alias ModuleIndex =
    Dict ModuleName Interface


type alias OperatorTable =
    Dict String AST.Infix
