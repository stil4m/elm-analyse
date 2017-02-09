module Analyser.Checks.UnusedTypeAliases exposing (scan)

import AST.Ranges exposing (Range)
import AST.Types exposing (FunctionSignature, TypeAlias, TypeReference(Typed))
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Types  exposing (MessageData(UnusedAlias))
import Dict exposing (Dict)
import Inspector exposing (Action(Post), defaultConfig)
import Interfaces.Interface exposing (doesExposeAlias)
import Tuple2
import Tuple3


type alias Context =
    Dict String ( String, Range, Int )


scan : FileContext -> List MessageData
scan fileContext =
    let
        collectedAliased : Context
        collectedAliased =
            Inspector.inspect
                { defaultConfig | onTypeAlias = Post onTypeAlias }
                fileContext.ast
                Dict.empty
    in
        Inspector.inspect
            { defaultConfig
                | onTypeReference = Post onTypeReference
                , onFunctionOrValue = Post onFunctionOrValue
            }
            fileContext.ast
            collectedAliased
            |> Dict.toList
            |> List.filter (Tuple.second >> Tuple3.third >> (<) 0 >> not)
            |> List.filter (Tuple.first >> flip doesExposeAlias fileContext.interface >> not)
            |> List.map (Tuple2.mapSecond Tuple3.second)
            |> List.map (uncurry (UnusedAlias fileContext.path))


markTypeAlias : String -> Context -> Context
markTypeAlias key context =
    Dict.update key (Maybe.map (Tuple3.mapThird ((+) 1))) context


onTypeReference : TypeReference -> Context -> Context
onTypeReference typeReference context =
    case typeReference of
        Typed [] x _ ->
            markTypeAlias x context

        _ ->
            context


onFunctionOrValue : String -> Context -> Context
onFunctionOrValue =
    markTypeAlias


onTypeAlias : TypeAlias -> Context -> Context
onTypeAlias typeAlias context =
    Dict.insert typeAlias.name ( typeAlias.name, typeAlias.range, 0 ) context
