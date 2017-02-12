module Parser.State exposing (State, emptyState, currentIndent, popIndent, pushIndent)


type State
    = State (List Int)


emptyState : State
emptyState =
    State []


currentIndent : State -> Int
currentIndent (State xs) =
    List.head xs |> Maybe.withDefault 0


popIndent : State -> State
popIndent (State s) =
    State <| List.drop 1 s


pushIndent : Int -> State -> State
pushIndent x (State s) =
    State (x :: s)
