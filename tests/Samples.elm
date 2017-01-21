module Samples exposing (..)


allSamples : List String
allSamples =
    [ sample1
    , sample2
    , sample3
    , sample4
    , sample5
    , sample6
    , sample7
    , sample8
    , sample9
    , sample10
    , sample11
    , sample12
    , sample13
    , sample14
    , sample15
    , sample16
    , sample17
    , sample18
    ]


sample1 : String
sample1 =
    """module HelloWorld exposing (..)

import Html exposing (text)

main =
  text "Hello, World!"
"""


sample2 : String
sample2 =
    """-- Read more about this program in the official Elm guide:
-- https://guide.elm-lang.org/architecture/user_input/buttons.html
module Buttons exposing (..)

import Html exposing (beginnerProgram, div, button, text)
import Html.Events exposing (onClick)

main =
  beginnerProgram { model = 0, view = view, update = update }


view model =
  div []
    [ button [ onClick Decrement ] [ text "-" ]
    , div [] [ text (toString model) ]
    , button [ onClick Increment ] [ text "+" ]
    ]


type Msg = Increment | Decrement


update msg model =
  case msg of
    Increment ->
      model + 1

    Decrement ->
      model - 1
"""


{-| Moduless file
-}
sample3 : String
sample3 =
    """import Html

main =
  Html.text <| toString foo

foo = 1
"""


sample4 : String
sample4 =
    """module Operators exposing ()

infixr 3 &&
infixr 2 ||
"""


sample5 : String
sample5 =
    """module Realm exposing (updateState)

{-| This library exposes a single helper function to help interface with the Realm npm package.

# updateState
@docs updateState
-}

{-| Given an update function and an outgoing port to send your Elm model into JavaScript, returns a new update function which automatically sends the new model to JavaScript after running the update.
-}

updateState : (msg -> model -> (model, Cmd msg)) -> SendPort msg model -> msg -> model -> (model, Cmd msg)
updateState update sendPort = curry <| (uncurry update) >> batchStateCmds sendPort


batchStateCmds : SendPort msg model -> (model, Cmd msg) -> (model, Cmd msg)
batchStateCmds sendPort nextStateAndCmd =
    1"""


sample6 : String
sample6 =
    """module Realm exposing (updateState)

type alias SendPort msg model = model -> Cmd msg

"""


sample7 : String
sample7 =
    """port module Store exposing (..)

bar foo =
    foo.bar

"""


sample8 : String
sample8 =
    """port module Store exposing (..)

foo bar =
  { bar | n = 2}
"""


sample9 : String
sample9 =
    """port module Store exposing (..)

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        NoOp ->
            model ! []

        Increment ->
            ({ model | value = model.value + 1})
              ! []

        Decrement ->
            ({ model | value = max 0 (model.value - 1)})
              ! []

        SetString str ->
            ({ model | inputString = toUpper str })
              ! []

      """


sample10 : String
sample10 =
    """module X

{k,v} = r"""


sample11 : String
sample11 =
    """module Foo

type alias X =
    { foo : Bar.Baz
    }
"""


sample12 : String
sample12 =
    """module Z

x : A -> B
x baz =
    let
        { bar } =
            baz

    in
        bar

"""


sample13 : String
sample13 =
    """module Foo


bar =
  (.) Foo

"""


sample14 : String
sample14 =
    """module G

e =
    let
        c = d
    in
        [
        ]
"""


sample15 : String
sample15 =
    """module G

e =
    let
        c =
            c
    in
        [ a
        ]
"""


sample16 : String
sample16 =
    """module Foo

bar baz3 =
  Foo1
"""


sample17 : String
sample17 =
    """module Foo
bar =
    '1'"""


sample18 : String
sample18 =
    """port module Ports exposing (..)

import Scroll exposing (Move)

port scroll : (Move -> msg) -> Sub msg"""
