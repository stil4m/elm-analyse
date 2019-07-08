module Analyser.Checks.MapNothingToNothingTests exposing (all, mapNothingToNothing, mapNothingToSomething, mapSomethingToNothing)

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
                { start = { row = 5, column = 5 }
                , end = { row = 5, column = 23 }
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
