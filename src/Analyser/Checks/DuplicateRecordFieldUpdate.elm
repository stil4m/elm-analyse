module Analyser.Checks.DuplicateRecordFieldUpdate exposing (checker)

import Elm.Syntax.Range as Syntax
import Elm.Syntax.Expression exposing (RecordUpdate, Expression)
import Analyser.Messages.Range as Range exposing (RangeContext)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Types exposing (Message, MessageData(DuplicateRecordFieldUpdate), newMessage)
import ASTUtil.Inspector as Inspector exposing (Order(Post), defaultConfig)
import Dict
import Analyser.Configuration exposing (Configuration)
import Analyser.Checks.Base exposing (Checker, keyBasedChecker)
import Dict.Extra as Dict


checker : Checker
checker =
    { check = scan
    , shouldCheck = keyBasedChecker [ "DuplicateRecordFieldUpdate" ]
    }


type alias Context =
    List ( String, List Syntax.Range )


scan : RangeContext -> FileContext -> Configuration -> List Message
scan rangeContext fileContext _ =
    Inspector.inspect
        { defaultConfig
            | onRecordUpdate = Post onRecordUpdate
        }
        fileContext.ast
        []
        |> List.map (Tuple.mapSecond (List.map (Range.build rangeContext)))
        |> List.map (uncurry (DuplicateRecordFieldUpdate fileContext.path))
        |> List.map (newMessage [ ( fileContext.sha1, fileContext.path ) ])


onRecordUpdate : RecordUpdate -> Context -> Context
onRecordUpdate { updates } context =
    updates
        |> Dict.groupBy Tuple.first
        |> Dict.filter (\_ v -> List.length v > 1)
        |> Dict.map (\_ v -> List.map (Tuple.second >> expressionRange) v)
        |> Dict.toList
        |> (++) context


expressionRange : Expression -> Syntax.Range
expressionRange ( r, _ ) =
    r
