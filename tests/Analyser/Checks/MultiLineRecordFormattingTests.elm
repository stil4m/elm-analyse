module Analyser.Checks.MultiLineRecordFormattingTests exposing (all)

import Analyser.Checks.MultiLineRecordFormatting as MultiLineRecordFormatting
import Test exposing (Test)
import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Messages.Types exposing (Message, MessageData(MultiLineRecordFormatting), newMessage)
import AST.Ranges exposing (emptyRange)


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


singleLineMultiField : ( String, String, List MessageData )
singleLineMultiField =
    ( "singleLineMultiField"
    , """module Bar exposing (Foo)

type alias Foo =
  { x : Int , y : String  }
"""
    , [ MultiLineRecordFormatting "./foo" emptyRange ]
    )


all : Test
all =
    CTU.build "Analyser.Checks.MultiLineRecordFormatting"
        MultiLineRecordFormatting.checker
        [ singleLineSingleField
        , multiLineMultiField
        , singleLineMultiField
        ]
