module Analyser.Checks.BooleanCaseTests exposing (..)

import Analyser.Checks.BooleanCase as BooleanCase
import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Messages.Data as Data exposing (MessageData)
import Test exposing (Test, only)


booleanCaseTrue : ( String, String, List MessageData )
booleanCaseTrue =
    ( "booleanCaseTrue"
    , """module Bar exposing (..)

foo x =
    case x of
        True ->
            x
        _ -> not x

"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 3, column = 4 }, end = { row = 6, column = 18 } }
      ]
    )


booleanCaseFalse : ( String, String, List MessageData )
booleanCaseFalse =
    ( "booleanCaseFalse"
    , """module Bar exposing (..)

foo x =
    case x of
        False ->
            x
        _ -> not x

"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 3, column = 4 }, end = { row = 6, column = 18 } }
      ]
    )


noBooleanCase : ( String, String, List MessageData )
noBooleanCase =
    ( "noBooleanCase"
    , """module Bar exposing (..)

foo x =
    case x of
        Some ->
            x
        Other -> not x

"""
    , []
    )


all : Test
all =
    CTU.build "Analyser.Checks.BooleanCase"
        BooleanCase.checker
        [ booleanCaseFalse
        , noBooleanCase
        , booleanCaseTrue
        ]
