module Analyser.Checks.DuplicateImport exposing (checker)

import AST.Ranges as Range
import ASTUtil.Inspector as Inspector exposing (Order(..), defaultConfig)
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Schema as Schema
import Dict exposing (Dict)
import Elm.Syntax.Import exposing (Import)
import Elm.Syntax.ModuleName exposing (ModuleName)
import Elm.Syntax.Node as Node exposing (Node(..))
import Elm.Syntax.Range as Range exposing (Range)


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
            , String.join " | " (List.map Range.rangeToString rs)
            , " ]"
            ]
        )
        |> Data.addModuleName "moduleName" m
        |> Data.addRanges "ranges" rs


type alias Context =
    Dict ModuleName (List Range)


scan : FileContext -> Configuration -> List MessageData
scan fileContext _ =
    Inspector.inspect
        { defaultConfig
            | onImport = Post onImport
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


onImport : Node Import -> Context -> Context
onImport (Node range imp) context =
    let
        moduleName =
            Node.value imp.moduleName
    in
    case Dict.get moduleName context of
        Just _ ->
            Dict.update moduleName (Maybe.map (\a -> a ++ [ range ])) context

        Nothing ->
            Dict.insert moduleName [ range ] context
