module Interfaces.DependencyTests exposing (..)

import Expect
import Interfaces.Dependencies as Dependencies
import Parser.Parser as Parser
import Test exposing (..)


all : Test.Test
all =
    describe "Interface.InterfaceTest"
        [ test "dependencies" <|
            \() ->
                Parser.parse importExample
                    |> Maybe.map Dependencies.find
                    |> Expect.equal
                        (Just
                            [ [ "Bar", "Baz" ]
                            , [ "String" ]
                            ]
                        )
        ]


importExample : String
importExample =
    """module Foo exposing (..)

import Bar.Baz
import String

foo x y = y + x

"""
