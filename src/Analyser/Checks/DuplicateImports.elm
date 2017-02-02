module Analyser.Checks.DuplicateImports exposing (scan)

import AST.Types exposing (InnerExpression(QualifiedExpr), ModuleName, Import)
import AST.Ranges exposing (Range)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages exposing (Message(DuplicateImport))
import Inspector exposing (Action(Post, Skip), defaultConfig)
import Dict exposing (Dict)
import Tuple2


type alias Context =
    Dict ModuleName ( Range, Int )


scan : FileContext -> List Message
scan fileContext =
    Inspector.inspect
        { defaultConfig
            | onImport = Post onImport
            , onFunction = Skip
        }
        fileContext.ast
        Dict.empty
        |> Dict.filter (\_ -> Tuple.second >> (<) 1)
        |> Dict.toList
        |> List.map (\( k, ( r, _ ) ) -> ( k, r ))
        |> List.map (uncurry (DuplicateImport fileContext.path))


onImport : Import -> Context -> Context
onImport imp context =
    case Dict.get imp.moduleName context of
        Just _ ->
            Dict.update imp.moduleName (Maybe.map (Tuple2.mapSecond ((+) 1))) context

        Nothing ->
            Dict.insert imp.moduleName ( imp.range, 1 ) context
