module Analyser.Checks.DuplicateImports exposing (scan)

import AST.Types exposing (InnerExpression, ModuleName, Import)
import AST.Ranges exposing (Range)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages exposing (Message(DuplicateImport))
import Inspector exposing (Action(Post, Skip), defaultConfig)
import Dict exposing (Dict)


type alias Context =
    Dict ModuleName (List Range)


scan : FileContext -> List Message
scan fileContext =
    Inspector.inspect
        { defaultConfig
            | onImport = Post onImport
            , onFunction = Skip
        }
        fileContext.ast
        Dict.empty
        |> Dict.filter (\_ -> List.length >> (<) 1)
        |> Dict.toList
        |> List.map (uncurry (DuplicateImport fileContext.path))


onImport : Import -> Context -> Context
onImport imp context =
    case Dict.get imp.moduleName context of
        Just x ->
            Dict.update imp.moduleName (Maybe.map (flip (++) [ imp.range ])) context

        Nothing ->
            Dict.insert imp.moduleName [ imp.range ] context
