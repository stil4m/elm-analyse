module Analyser.Checks.UnusedTypeAlias exposing (checker)

import AST.Ranges as Range
import ASTUtil.Inspector as Inspector exposing (Order(..), defaultConfig)
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Schema as Schema
import Dict exposing (Dict)
import Elm.Interface as Interface
import Elm.Syntax.Node as Node exposing (Node(..))
import Elm.Syntax.Range as Range exposing (Range)
import Elm.Syntax.TypeAlias exposing (TypeAlias)
import Elm.Syntax.TypeAnnotation exposing (TypeAnnotation(..))
import Tuple.Extra


checker : Checker
checker =
    { check = scan
    , info =
        { key = "UnusedTypeAlias"
        , name = "Unused Type Alias"
        , description = "You defined a type alias, but you do not use it in any signature or expose it."
        , schema =
            Schema.schema
                |> Schema.varProp "varName"
                |> Schema.rangeProp "range"
        }
    }


type alias Context =
    Dict String ( String, Range, Int )


scan : FileContext -> Configuration -> List MessageData
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
            | onTypeAnnotation = Post onTypeAnnotation
            , onFunctionOrValue = Post onFunctionOrValue
        }
        fileContext.ast
        collectedAliased
        |> Dict.toList
        |> List.filter (Tuple.second >> Tuple.Extra.third3 >> (<) 0 >> not)
        |> List.filter (Tuple.first >> (\a -> Interface.exposesAlias a fileContext.interface) >> not)
        |> List.map (Tuple.mapSecond Tuple.Extra.second3)
        |> List.map buildMessageData


buildMessageData : ( String, Range ) -> MessageData
buildMessageData ( varName, range ) =
    Data.init
        (String.concat
            [ "Type alias `"
            , varName
            , "` is not used at "
            , Range.rangeToString range
            ]
        )
        |> Data.addVarName "varName" varName
        |> Data.addRange "range" range


markTypeAlias : String -> Context -> Context
markTypeAlias key context =
    Dict.update key (Maybe.map (Tuple.Extra.mapThird3 ((+) 1))) context


onTypeAnnotation : Node TypeAnnotation -> Context -> Context
onTypeAnnotation (Node _ typeAnnotation) context =
    case typeAnnotation of
        Typed (Node _ ( [], x )) _ ->
            markTypeAlias x context

        _ ->
            context


onFunctionOrValue : ( a, String ) -> Context -> Context
onFunctionOrValue =
    Tuple.second >> markTypeAlias


onTypeAlias : Node TypeAlias -> Context -> Context
onTypeAlias (Node range typeAlias) context =
    Dict.insert (Node.value typeAlias.name) ( Node.value typeAlias.name, range, 0 ) context
