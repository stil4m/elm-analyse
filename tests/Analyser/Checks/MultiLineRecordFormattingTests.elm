module Analyser.Checks.MultiLineRecordFormattingTests exposing (all)

import Analyser.Checks.MultiLineRecordFormatting as MultiLineRecordFormatting
import Test exposing (Test)
import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Messages.Types exposing (Message, MessageData(MultiLineRecordFormatting), newMessage)


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
    , [ MultiLineRecordFormatting "./foo.elm" { start = { row = 4, column = 7 }, end = { row = 5, column = -2 } } ]
    )


singleLineMultiField : ( String, String, List MessageData )
singleLineMultiField =
    ( "singleLineMultiField"
    , """module Bar exposing (Foo)

type alias Foo =
  { x : Int , y : String  }
"""
    , [ MultiLineRecordFormatting "./foo.elm" { start = { row = 3, column = 1 }, end = { row = 4, column = -2 } } ]
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
