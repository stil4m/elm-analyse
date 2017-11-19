module Analyser.Checks.UnusedTypeAlias exposing (checker)

import ASTUtil.Inspector as Inspector exposing (Order(Post), defaultConfig)
import Analyser.Checks.Base exposing (Checker, keyBasedChecker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Range as Range exposing (Range, RangeContext)
import Analyser.Messages.Types exposing (Message, MessageData(UnusedTypeAlias), newMessage)
import Dict exposing (Dict)
import Elm.Interface as Interface
import Elm.Syntax.TypeAlias exposing (..)
import Elm.Syntax.TypeAnnotation exposing (..)
import Tuple3


checker : Checker
checker =
    { check = scan
    , shouldCheck = keyBasedChecker [ "UnusedTypeAlias" ]
    , key = "UnusedTypeAlias"
    , name = "Unused Type Alias"
    , description = "You defined a type alias, but you do not use it in any signature or expose it."
    }


type alias Context =
    Dict String ( String, Range, Int )


scan : RangeContext -> FileContext -> Configuration -> List Message
scan rangeContext fileContext _ =
    let
        collectedAliased : Context
        collectedAliased =
            Inspector.inspect
                { defaultConfig | onTypeAlias = Post (onTypeAlias rangeContext) }
                fileContext.ast
                Dict.empty
    in
    Inspector.inspect
        { defaultConfig
            | onTypeAnnotation = Post onTypeAnnotation
            , onFunctionOrValue = Post onFunctionOrValue
        }
        fileContext.ast
        collectedAliased
        |> Dict.toList
        |> List.filter (Tuple.second >> Tuple3.third >> (<) 0 >> not)
        |> List.filter (Tuple.first >> flip Interface.exposesAlias fileContext.interface >> not)
        |> List.map (Tuple.mapSecond Tuple3.second)
        |> List.map (uncurry (UnusedTypeAlias fileContext.path))
        |> List.map (newMessage [ ( fileContext.sha1, fileContext.path ) ])


markTypeAlias : String -> Context -> Context
markTypeAlias key context =
    Dict.update key (Maybe.map (Tuple3.mapThird ((+) 1))) context


onTypeAnnotation : TypeAnnotation -> Context -> Context
onTypeAnnotation typeAnnotation context =
    case typeAnnotation of
        Typed [] x _ _ ->
            markTypeAlias x context

        _ ->
            context


onFunctionOrValue : String -> Context -> Context
onFunctionOrValue =
    markTypeAlias


onTypeAlias : RangeContext -> TypeAlias -> Context -> Context
onTypeAlias rangeContext typeAlias context =
    Dict.insert typeAlias.name ( typeAlias.name, Range.build rangeContext typeAlias.range, 0 ) context
