module Analyser.Checks.SingleFieldRecord exposing (checker)

import ASTUtil.Inspector as Inspector exposing (..)
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Range as Range exposing (RangeContext)
import Analyser.Messages.Schema as Schema
import Elm.Syntax.Range as Syntax
import Elm.Syntax.TypeAnnotation exposing (..)


checker : Checker
checker =
    { check = scan
    , info =
        { key = "SingleFieldRecord"
        , name = "Single Field Record"
        , description = "Using a record is obsolete if you only plan to store a single field in it."
        , schema =
            Schema.schema
                |> Schema.rangeProp "range"
        }
    }


scan : RangeContext -> FileContext -> Configuration -> List MessageData
scan rangeContext fileContext _ =
    Inspector.inspect
        { defaultConfig | onTypeAnnotation = Post onTypeAnnotation }
        fileContext.ast
        []
        |> List.filter (Tuple.second >> isSingleFieldRecord)
        |> List.map (Tuple.first >> Range.build rangeContext)
        |> List.map
            (\r ->
                Data.init
                    (String.concat
                        [ "Record has only one field. Use the field's type or introduce a Type. At "
                        , Range.asString r
                        ]
                    )
                    |> Data.addRange "range" r
            )


isSingleFieldRecord : RecordDefinition -> Bool
isSingleFieldRecord x =
    List.length x == 1


onTypeAnnotation : TypeAnnotation -> List ( Syntax.Range, RecordDefinition ) -> List ( Syntax.Range, RecordDefinition )
onTypeAnnotation x context =
    findPlainRecords x ++ context


findPlainRecords : TypeAnnotation -> List ( Syntax.Range, RecordDefinition )
findPlainRecords x =
    case x of
        Record fields r ->
            [ ( r, fields ) ]

        _ ->
            []
