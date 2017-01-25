module Analyser.Types exposing (..)

import AST.Types as AST
import Interfaces.Interface as Interface


type alias LoadedDependencies =
    List LoadedDependency


type alias LoadedDependency =
    { dependency : String
    , interfaces : List ( String, Result String LoadedInterface )
    }


type alias LoadedInterface =
    { moduleName : Maybe AST.ModuleName
    , interface : Interface.Interface
    }
