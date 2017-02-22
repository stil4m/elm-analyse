module Analyser.Checks.LineLength exposing (checker)

import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Types exposing (Message, MessageData(LineLengthExceeded), newMessage)
import Analyser.Configuration exposing (Configuration)
import Analyser.Checks.Base exposing (Checker, keyBasedChecker)


checker : Checker
checker =
    { check = scan
    , shouldCheck = keyBasedChecker [ "LineLengthExceeded" ]
    }


scan : FileContext -> Configuration -> List Message
scan fileContext _ =
    let
        longLineRanges =
            String.split "\n" fileContext.content
                |> List.indexedMap (,)
                |> List.filter (Tuple.second >> String.length >> (<) 150)
                |> List.filter (Tuple.second >> String.startsWith "module" >> not)
                |> List.filter (Tuple.second >> String.startsWith "import" >> not)
                |> List.map (\( x, _ ) -> { start = { row = x, column = -1 }, end = { row = x + 1, column = -2 } })
    in
        if List.isEmpty longLineRanges then
            []
        else
            [ newMessage
                [ ( fileContext.sha1, fileContext.path ) ]
                (LineLengthExceeded fileContext.path longLineRanges)
            ]
