module Analyser.Checks.SingleFieldRecordTests exposing (all)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.SingleFieldRecord as SingleFieldRecord
import Analyser.Messages.Data as Data exposing (MessageData)
import Test exposing (Test)


singleField : ( String, String, List MessageData )
singleField =
    ( "singleField"
    , """module Bar exposing (Foo)

type alias Foo =
  { x : Int }
"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 3, column = 2 }, end = { row = 3, column = 13 } }
      ]
    )


singleFieldGeneric : ( String, String, List MessageData )
singleFieldGeneric =
    ( "singleFieldGeneric"
    , """module Bar exposing (Foo)

type alias Foo a =
  { a | x : Int }
"""
    , []
    )


multiField : ( String, String, List MessageData )
multiField =
    ( "multiField"
    , """module Bar exposing (Foo)

type alias Foo =
  { x : Int
  , y : String
  }
"""
    , []
    )


singleFieldNested : ( String, String, List MessageData )
singleFieldNested =
    ( "singleFieldNested"
    , """module Bar exposing (Foo)

type alias Foo =
  { x : Int
  , y : { z : String }
  }
"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 4, column = 8 }, end = { row = 4, column = 22 } }
      ]
    )


singleFieldInType : ( String, String, List MessageData )
singleFieldInType =
    ( "singleFieldInType"
    , """module Bar exposing (Foo)

type Foo =
  Bar { x : Int }
"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 3, column = 6 }, end = { row = 3, column = 17 } }
      ]
    )


all : Test
all =
    CTU.build "Analyser.Checks.SingleFieldRecord"
        SingleFieldRecord.checker
        [ singleField
        , singleFieldGeneric
        , multiField
        , singleFieldNested
        , singleFieldInType
        ]
