module Parser.State exposing (State, emptyState, currentIndent, popIndent, pushIndent)


type State
    = State
        { indents : List Int
        , comments : List String
        }


emptyState : State
emptyState =
    State { indents = [], comments = [] }


currentIndent : State -> Int
currentIndent (State { indents }) =
    List.head indents |> Maybe.withDefault 0


popIndent : State -> State
popIndent (State s) =
    State { s | indents = List.drop 1 s.indents }


pushIndent : Int -> State -> State
pushIndent x (State s) =
    State { s | indents = x :: s.indents }
