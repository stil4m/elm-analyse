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
    , sample19
    , sample20
    , sample21
    , sample22
    , sample23
    , sample24
    , sample25
    , sample26
    , sample27
    , sample28
    , sample29

    ]

sample29 : String
sample29 =
  """module Foo

x = '\\x0D'
"""

sample28 : String
sample28 =
    """Foo

x =
    let
        result : Int
        result =
            1
    in
        result
"""


sample27 : String
sample27 =
    """module Foo

type alias Post = {
  id: Int,
  title: String,
  text: Maybe String
}

"""


{-| Let with comments and exact indent
-}
sample26 : String
sample26 =
    """module Foo

x b =
  let
      a =
          b

      --time
  in
      1


"""


foo : number -> number1
foo x =
    case x of
        1 ->
            2

        _ ->
            1


{-| Trailing whitespace multiline comment
-}
sample25 : String
sample25 =
    String.concat
        [ "module HelloWorld exposing (..)\n\n"
        , "{-| an individual Note (no pitch class implies a rest) -}    \n"
        , "type alias AnInt = Int\n"
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
            { model | value = model}! []



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


sample19 : String
sample19 =
    """module Foo


timeAgo time now =
    if x then
        1
    else if x then
        2
    else if x then
        2
    else if x then
        2
    else if x then
        2
    else if x then
        2
    else if x then
        2
    else if x then
        2
    else if x then
        2
    else if x then
        2
    else if x then
        2
    else if x then
        2
    else if x then
        2
    else if x then
        2
    else if x then
        2
    else if x then
        2
    else if x then
        2
    else if x then
        2
    else if x then
        2
    else if x then
        2
    else if x then
        2
    else
        3

"""


sample20 : String
sample20 =
    """module Baz

foo = bar
-- some

"""


sample21 : String
sample21 =
    """module Elmo8.Layers.Background exposing (..)

{-| Background layer

Used for rendering backgrounds (and maps?)

TODO: Decide if just for backgrounds or for maps/levels too

-}

import Math.Vector2 exposing (Vec2, vec2, fromTuple)
import WebGL


-- From http://blog.tojicode.com/2012/07/sprite-tile-maps-on-gpu.html
-- TODO: make this work :)


tileMapVertextShader : WebGL.Shader { attr | position : Vec2, texture : Vec2 } { uniform | viewOffset : Vec2, viewportSize : Vec2, inverseTileTextureSize : Vec2, inverseTileSize : Float } { pixelCoord : Vec2, texCoord : Vec2 }
tileMapVertextShader =
    [glsl|
    precision mediump float;
    attribute vec2 position;
    attribute vec2 texture;

    varying vec2 pixelCoord;
    varying vec2 texCoord;

    uniform vec2 viewOffset;
    uniform vec2 viewportSize;
    uniform vec2 inverseTileTextureSize;
    uniform float inverseTileSize;

    void main(void) {
        pixelCoord = (texture * viewportSize) + viewOffset;
        texCoord = pixelCoord * inverseTileTextureSize * inverseTileSize;
        gl_Position = vec4(position, 0.0, 1.0);
    }
|]

"""


sample22 : String
sample22 =
    """module Foo

x : a -> b -> a
x y z =
  let
    _ = 1
  in
    z
"""


sample23 : String
sample23 =
    """module Foo

x s =
  let indent = String.length s in
  indent

"""


sample24 : String
sample24 =
    """module Foo

tests =
    \\() -> Expect.equal "'\\\\''" (toString '\\'')
"""
