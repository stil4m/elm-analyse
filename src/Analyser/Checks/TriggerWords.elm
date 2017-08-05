module Analyser.Checks.TriggerWords exposing (checker)

import Analyser.Checks.Base exposing (Checker, keyBasedChecker)
import Analyser.Configuration as Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Range as Range exposing (RangeContext)
import Analyser.Messages.Types exposing (Message, MessageData(TriggerWord), newMessage)
import Elm.Syntax.Range as Syntax
import Json.Decode as JD
import Regex
import Set


checker : Checker
checker =
    { check = scan
    , shouldCheck = keyBasedChecker [ "TriggerWords" ]
    }


defaultTriggerWords : List String
defaultTriggerWords =
    [ "TODO" ]


scan : RangeContext -> FileContext -> Configuration -> List Message
scan rangeContext fileContext configuration =
    let
        triggerWords =
            Configuration.checkPropertyAs (JD.list JD.string) "TriggerWords" "words" configuration
                |> Maybe.withDefault defaultTriggerWords
    in
    fileContext.ast.comments
        |> List.filterMap (withTriggerWord triggerWords)
        |> List.map (Tuple.mapSecond (Range.build rangeContext) >> uncurry (TriggerWord fileContext.path))
        |> List.map (newMessage [ ( fileContext.sha1, fileContext.path ) ])


splitRegex : Regex.Regex
splitRegex =
    Regex.regex "[^\\w]+"


withTriggerWord : List String -> ( String, Syntax.Range ) -> Maybe ( String, Syntax.Range )
withTriggerWord words ( commentText, range ) =
    let
        commentWords =
            Regex.split Regex.All splitRegex commentText
                |> List.map normalizeWord
                |> Set.fromList
    in
    words
        |> List.map (\x -> ( x, normalizeWord x ))
        |> List.filter (Tuple.second >> flip Set.member commentWords)
        |> List.head
        |> Maybe.map (Tuple.first >> flip (,) range)


normalizeWord : String -> String
normalizeWord =
    String.toLower
