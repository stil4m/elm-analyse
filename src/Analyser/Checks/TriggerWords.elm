module Analyser.Checks.TriggerWords exposing (checker)

import AST.Ranges as Range
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration as Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Schema as Schema
import Elm.Syntax.Range as Syntax exposing (Range)
import Json.Decode as JD
import Regex
import Set


checker : Checker
checker =
    { check = scan
    , info =
        { key = "TriggerWords"
        , name = "Trigger Words"
        , description = "Comments can tell you what that you have to put your code a bit more attention. You should resolve things as 'TODO' and such."
        , schema =
            Schema.schema
                |> Schema.varProp "word"
                |> Schema.rangeProp "range"
        }
    }


defaultTriggerWords : List String
defaultTriggerWords =
    [ "TODO" ]


scan : FileContext -> Configuration -> List MessageData
scan fileContext configuration =
    let
        triggerWords =
            Configuration.checkPropertyAs (JD.list JD.string) "TriggerWords" "words" configuration
                |> Maybe.withDefault defaultTriggerWords
    in
    fileContext.ast.comments
        |> List.filterMap (withTriggerWord triggerWords)
        |> List.map buildMessage


buildMessage : ( String, Range ) -> MessageData
buildMessage ( word, range ) =
    Data.init
        (String.concat
            [ "`" ++ word ++ "` should not be used in comments. Found at "
            , Range.rangeToString range
            ]
        )
        |> Data.addVarName "word" word
        |> Data.addRange "range" range


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
