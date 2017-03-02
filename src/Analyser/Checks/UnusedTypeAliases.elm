module Analyser.Checks.UnusedTypeAliases exposing (checker)

import AST.Ranges exposing (Range)
import AST.Types exposing (FunctionSignature, TypeAlias, TypeReference(Typed))
import Analyser.FileContext exposing (FileContext)
import Analyser.Files.Interface exposing (doesExposeAlias)
import Analyser.Messages.Types exposing (Message, MessageData(UnusedTypeAlias), newMessage)
import Dict exposing (Dict)
import Inspector exposing (Order(Post), defaultConfig)
import Tuple2
import Tuple3
import Analyser.Configuration exposing (Configuration)
import Analyser.Checks.Base exposing (Checker, keyBasedChecker)


checker : Checker
checker =
    { check = scan
    , shouldCheck = keyBasedChecker [ "UnusedTypeAlias" ]
    }


type alias Context =
    Dict String ( String, Range, Int )


scan : FileContext -> Configuration -> List Message
scan fileContext _ =
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
            |> List.map (uncurry (UnusedTypeAlias fileContext.path))
            |> List.map (newMessage [ ( fileContext.sha1, fileContext.path ) ])


markTypeAlias : String -> Context -> Context
markTypeAlias key context =
    Dict.update key (Maybe.map (Tuple3.mapThird ((+) 1))) context


onTypeReference : TypeReference -> Context -> Context
onTypeReference typeReference context =
    case typeReference of
        Typed [] x _ _ ->
            markTypeAlias x context

        _ ->
            context


onFunctionOrValue : String -> Context -> Context
onFunctionOrValue =
    markTypeAlias


onTypeAlias : TypeAlias -> Context -> Context
onTypeAlias typeAlias context =
    Dict.insert typeAlias.name ( typeAlias.name, typeAlias.range, 0 ) context
