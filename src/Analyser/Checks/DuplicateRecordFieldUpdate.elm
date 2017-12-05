module Analyser.Checks.DuplicateRecordFieldUpdate exposing (checker)

import ASTUtil.Inspector as Inspector exposing (Order(Post), defaultConfig)
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Schema as Schema
import Dict
import Dict.Extra as Dict
import Elm.Syntax.Expression exposing (RecordUpdate)
import Elm.Syntax.Range as Range


checker : Checker
checker =
    { check = scan
    , info =
        { key = "DuplicateRecordFieldUpdate"
        , name = "Duplicate Record Field Update"
        , description = "You only want to update a field once in the record update syntax. Doing twice may only cause bugs."
        , schema =
            Schema.schema
                |> Schema.rangeListProp "ranges"
                |> Schema.varProp "fieldName"
        }
    }


type alias Context =
    List MessageData


scan : FileContext -> Configuration -> List MessageData
scan fileContext _ =
    Inspector.inspect
        { defaultConfig
            | onRecordUpdate = Post onRecordUpdate
        }
        fileContext.ast
        []


onRecordUpdate : RecordUpdate -> Context -> Context
onRecordUpdate { updates } context =
    updates
        |> Dict.groupBy Tuple.first
        |> Dict.filter (\_ v -> List.length v > 1)
        |> Dict.map (\_ v -> List.map (Tuple.second >> Tuple.first) v)
        |> Dict.toList
        |> List.map buildMessageData
        |> (++) context


buildMessageData : ( String, List Range.Range ) -> MessageData
buildMessageData ( fieldName, ranges ) =
    Data.init
        (String.concat
            [ "The '"
            , fieldName
            , "' field for a record is updated multiple times in one expression."
            ]
        )
        |> Data.addVarName "fieldName" fieldName
        |> Data.addRanges "ranges" ranges
