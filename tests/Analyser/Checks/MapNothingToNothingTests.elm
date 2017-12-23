module Analyser.Checks.MapNothingToNothingTests exposing (..)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.MapNothingToNothing as MapNothingToNothing
import Analyser.Messages.Data as Data exposing (MessageData)
import Test exposing (Test)


mapNothingToNothing : ( String, String, List MessageData )
mapNothingToNothing =
    ( "mapNothingToNothing"
    , """module Foo exposing (..)

y = case x of
    Just a -> Just (a + 1)
    Nothing -> Nothing
"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 4, column = 4 }
                , end = { row = 4, column = 22 }
                }
      ]
    )


mapNothingToSomething : ( String, String, List MessageData )
mapNothingToSomething =
    ( "mapNothingToSomething"
    , """module Foo exposing (..)

y = case x of
    Just a -> Just (a + 1)
    Nothing -> 0
"""
    , []
    )


mapSomethingToNothing : ( String, String, List MessageData )
mapSomethingToNothing =
    ( "mapSomethingToNothing"
    , """module Foo exposing (..)

y = case x of
    Just a -> Nothing
    Nothing -> 0
"""
    , []
    )


all : Test
all =
    CTU.build "Analyser.Checks.MapNothingToNothing"
        MapNothingToNothing.checker
        [ mapNothingToNothing
        , mapNothingToSomething
        , mapSomethingToNothing
        ]
