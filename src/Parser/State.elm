module Parser.State exposing (State, emptyState, currentIndent, popIndent, pushIndent, addComment, getComments)

import AST.Ranges exposing (Range)


type State
    = State
        { indents : List Int
        , comments : List ( String, Range )
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


addComment : ( String, Range ) -> State -> State
addComment pair (State s) =
    State { s | comments = pair :: s.comments }


getComments : State -> List ( String, Range )
getComments (State s) =
    s.comments
