module Analyser.Checks.DuplicateImport exposing (checker)

import ASTUtil.Inspector as Inspector exposing (Order(Post, Skip), defaultConfig)
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Range as Range exposing (Range, RangeContext)
import Analyser.Messages.Schema as Schema
import Dict exposing (Dict)
import Elm.Syntax.Base exposing (ModuleName)
import Elm.Syntax.Module exposing (Import)


checker : Checker
checker =
    { check = scan
    , info =
        { key = "DuplicateImport"
        , name = "Duplicate Import"
        , description = "You are importing the same module twice."
        , schema =
            Schema.schema
                |> Schema.rangeListProp "ranges"
                |> Schema.moduleProp "moduleName"
        }
    }


buildData : ( ModuleName, List Range ) -> MessageData
buildData ( m, rs ) =
    Data.init
        (String.concat
            [ "Duplicate import for module `"
            , String.join "." m
            , "`` at [ "
            , String.join " | " (List.map Range.asString rs)
            , " ]"
            ]
        )
        |> Data.addModuleName "moduleName" m
        |> Data.addRanges "ranges" rs


type alias Context =
    Dict ModuleName (List Range)


scan : RangeContext -> FileContext -> Configuration -> List MessageData
scan rangeContext fileContext _ =
    Inspector.inspect
        { defaultConfig
            | onImport = Post (onImport rangeContext)
            , onFunction = Skip
        }
        fileContext.ast
        Dict.empty
        |> Dict.filter (always (hasLength ((<) 1)))
        |> Dict.toList
        |> List.map buildData


hasLength : (Int -> Bool) -> List a -> Bool
hasLength f =
    List.length >> f


onImport : RangeContext -> Import -> Context -> Context
onImport rangeContext { moduleName, range } context =
    case Dict.get moduleName context of
        Just _ ->
            Dict.update moduleName (Maybe.map (flip (++) [ Range.build rangeContext range ])) context

        Nothing ->
            Dict.insert moduleName [ Range.build rangeContext range ] context
