module Analyser.Messages.Grouped exposing (GroupedMessages, byFileName, byType, isEmpty, map)

import Analyser.Messages.Types exposing (Message)
import Dict
import Dict.Extra as Dict


type GroupedMessages
    = GroupedMessages (Message -> String) (List ( String, List Message ))


isEmpty : GroupedMessages -> Bool
isEmpty (GroupedMessages _ xs) =
    List.isEmpty xs


map : (( String, List ( String, Message ) ) -> b) -> GroupedMessages -> List b
map f (GroupedMessages mf gm) =
    List.map (Tuple.mapSecond (List.map (\x -> ( mf x, x ))) >> f) gm


byType : List Message -> GroupedMessages
byType messages =
    messages
        |> Dict.groupBy .type_
        |> Dict.toList
        |> List.sortBy Tuple.first
        |> GroupedMessages (.file >> .path)


byFileName : List Message -> GroupedMessages
byFileName messages =
    messages
        |> List.map (\m -> ( m.file.path, m ))
        |> Dict.groupBy Tuple.first
        |> Dict.map (\_ v -> List.map Tuple.second v)
        |> Dict.toList
        |> List.sortBy Tuple.first
        |> GroupedMessages .type_
