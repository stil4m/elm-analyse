module Analyser.LoadedDependencies exposing (LoadedDependencies, LoadedDependency, LoadedInterface, messages)

import AST.Types as AST
import Analyser.Messages as M exposing (Message)
import Analyser.Types exposing (FileLoad(Failed), LoadedFile)
import Interfaces.Interface as Interface


type alias LoadedDependencies =
    List LoadedDependency


type alias LoadedDependency =
    { dependency : String
    , interfaces : List LoadedFile
    }


type alias LoadedInterface =
    { moduleName : Maybe AST.ModuleName
    , interface : Interface.Interface
    }


messages : LoadedDependencies -> List Message
messages =
    List.concatMap
        (\{ dependency, interfaces } ->
            interfaces
                |> List.filter (Tuple.second >> (==) Failed)
                |> List.map (Tuple.first >> .path >> M.UnreadableDependencyFile dependency)
        )
