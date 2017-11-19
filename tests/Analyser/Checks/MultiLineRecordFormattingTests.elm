module Analyser.Checks.MultiLineRecordFormattingTests exposing (all)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.MultiLineRecordFormatting as MultiLineRecordFormatting
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Range as Range
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
                (Range.manual
                    { start = { row = 4, column = 8 }, end = { row = 4, column = 33 } }
                    { start = { row = 4, column = 7 }, end = { row = 5, column = -2 } }
                )
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
                (Range.manual
                    { start = { row = 3, column = 2 }, end = { row = 3, column = 27 } }
                    { start = { row = 3, column = 1 }, end = { row = 4, column = -2 } }
                )
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
