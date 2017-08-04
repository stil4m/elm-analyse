module Analyser.Files.Types
    exposing
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
import Elm.Syntax.Base as AST
import Elm.Syntax.Infix as AST


type alias Version =
    String


type alias LoadedSourceFiles =
    List LoadedSourceFile


type alias LoadedSourceFile =
    ( FileContent, Result String RawFile )


type alias LoadedFileData =
    { interface : Interface
    , moduleName : Maybe AST.ModuleName
    , ast : RawFile
    }


type alias ModuleIndex =
    Dict AST.ModuleName Interface


type alias OperatorTable =
    Dict String AST.Infix



--
-- type alias FileContent =
--     { path : String
--     , success : Bool
--     , sha1 : Maybe String
--     , content : Maybe String
--     , ast : Maybe String
--     , formatted : Bool
--     }
