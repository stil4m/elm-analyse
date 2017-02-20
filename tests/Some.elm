module Some exposing (..)

import Test exposing (..)
import Expect
import Parser.Parser as Parser
import Combine exposing (..)
import Parser.Util exposing (exactIndentWhitespace)
import Parser.State exposing (State, emptyState)


input : String
input =
    "module\nsome"


x : Parser State ( ParseLocation, String, String, ParseLocation )
x =
    succeed (,,,)
        <*> withLocation (\l -> succeed l)
        <*> string "module"
        <*> exactIndentWhitespace
        <*> withLocation (\l -> succeed l)


failingINput : String
failingINput =
    """module Foo exposing (foo)
import Bar"""


all : Test
all =
    describe "Some"
        [ test "Parser" <|
            \() ->
                Combine.runParser x emptyState input
                    |> Result.toMaybe
                    |> Debug.log "X"
                    |> Expect.equal Nothing
        , test "Other" <|
            \() ->
                Parser.parse failingINput
                    |> Debug.log "X"
                    |> Expect.equal Nothing
        ]
