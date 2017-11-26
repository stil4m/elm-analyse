module Analyser.Checks.LineLength exposing (checker)

import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration as Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Range as Range exposing (RangeContext)
import Analyser.Messages.Schema as Schema


checker : Checker
checker =
    { check = scan
    , info =
        { key = "LineLengthExceeded"
        , name = "Line Length Exceeded"
        , description = "This check will mark files that contain lines that exceed over 150 characters (see 'check-specific-configuration' below to change the maximum line length)."
        , schema =
            Schema.schema
                |> Schema.rangeListProp "ranges"
        }
    }


scan : RangeContext -> FileContext -> Configuration -> List MessageData
scan rangeContext fileContext configuration =
    let
        threshold =
            Configuration.checkPropertyAsInt "LineLengthExceeded" "threshold" configuration
                |> Maybe.withDefault 150

        longLineRanges =
            String.split "\n" fileContext.content
                |> List.indexedMap (,)
                |> List.filter (Tuple.second >> String.length >> (<) threshold)
                |> List.filter (Tuple.second >> String.startsWith "module" >> not)
                |> List.filter (Tuple.second >> String.startsWith "import" >> not)
                |> List.map (\( x, _ ) -> { start = { row = x, column = -1 }, end = { row = x + 1, column = -2 } })
    in
    if List.isEmpty longLineRanges then
        []
    else
        [ let
            rs =
                List.map (Range.build rangeContext) longLineRanges
          in
          Data.init
            (String.concat
                [ "Line length exceeded on line(s) "
                , toString (List.map Range.startLine rs)
                , "\"."
                ]
            )
            |> Data.addRanges "ranges" rs
        ]
