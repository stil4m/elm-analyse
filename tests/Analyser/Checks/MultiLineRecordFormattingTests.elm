module Analyser.Checks.MultiLineRecordFormattingTests exposing (all)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.MultiLineRecordFormatting as MultiLineRecordFormatting
import Analyser.Messages.Data as Data exposing (MessageData)
import Test exposing (Test)


singleLineSingleField : ( String, String, List MessageData )
singleLineSingleField =
    ( "singleLineSingleField"
    , """module Bar exposing (Foo)

type alias Foo =
  { x : Int }
"""
    , []
    )


multiLineMultiField : ( String, String, List MessageData )
multiLineMultiField =
    ( "multiLineMultiField"
    , """module Bar exposing (Foo)

type alias Foo =
  { x : Int
  , y : String
  }
"""
    , []
    )


multiLineMultiFieldWithNested : ( String, String, List MessageData )
multiLineMultiFieldWithNested =
    ( "multiLineMultiFieldWithNested"
    , """module Bar exposing (Foo)

type alias Foo =
  { x : Int
  , y : { z : String, a : String}
  }
"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                { end = { column = 34, row = 5 }, start = { column = 9, row = 5 } }
      ]
    )


singleLineMultiField : ( String, String, List MessageData )
singleLineMultiField =
    ( "singleLineMultiField"
    , """module Bar exposing (Foo)

type alias Foo =
  { x : Int , y : String  }
"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                { start = { row = 4, column = 3 }, end = { row = 4, column = 28 } }
      ]
    )


all : Test
all =
    CTU.build "Analyser.Checks.MultiLineRecordFormatting"
        MultiLineRecordFormatting.checker
        [ singleLineSingleField
        , multiLineMultiField
        , multiLineMultiFieldWithNested
        , singleLineMultiField
        ]
