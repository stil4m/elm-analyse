module Analyser.Checks.DuplicateImports exposing (scan)

import AST.Types exposing (InnerExpression, ModuleName, Import)
import AST.Ranges exposing (Range)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Types  exposing (MessageData(DuplicateImport))
import Inspector exposing (Action(Post, Skip), defaultConfig)
import Dict exposing (Dict)


type alias Context =
    Dict ModuleName (List Range)


scan : FileContext -> List MessageData
scan fileContext =
    Inspector.inspect
        { defaultConfig
            | onImport = Post onImport
            , onFunction = Skip
        }
        fileContext.ast
        Dict.empty
        |> Dict.filter (always (hasLength ((<) 1)))
        |> Dict.toList
        |> List.map (uncurry (DuplicateImport fileContext.path))


hasLength : (Int -> Bool) -> List a -> Bool
hasLength f =
    List.length >> f


onImport : Import -> Context -> Context
onImport { moduleName, range } context =
    case Dict.get moduleName context of
        Just _ ->
            Dict.update moduleName (Maybe.map (flip (++) [ range ])) context

        Nothing ->
            Dict.insert moduleName [ range ] context
