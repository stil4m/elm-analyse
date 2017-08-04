module Analyser.Checks.SingleFieldRecordTests exposing (all)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.SingleFieldRecord as SingleFieldRecord
import Analyser.Messages.Range as Range
import Analyser.Messages.Types exposing (Message, MessageData(SingleFieldRecord), newMessage)
import Test exposing (Test)


singleField : ( String, String, List MessageData )
singleField =
    ( "singleLineSingleField"
    , """module Bar exposing (Foo)

type alias Foo =
  { x : Int }
"""
    , [ SingleFieldRecord "./foo.elm" <|
            Range.manual
                { start = { row = 3, column = 2 }, end = { row = 3, column = 13 } }
                { start = { row = 3, column = 1 }, end = { row = 4, column = -2 } }
      ]
    )


singleFieldGeneric : ( String, String, List MessageData )
singleFieldGeneric =
    ( "singleLineSingleField"
    , """module Bar exposing (Foo)

type alias Foo a =
  { a | x : Int }
"""
    , []
    )


multiField : ( String, String, List MessageData )
multiField =
    ( "multiLineMultiField"
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
    ( "multiLineMultiFieldWithNested"
    , """module Bar exposing (Foo)

type alias Foo =
  { x : Int
  , y : { z : String }
  }
"""
    , [ SingleFieldRecord "./foo.elm" <|
            Range.manual
                { start = { row = 4, column = 8 }, end = { row = 4, column = 22 } }
                { start = { row = 4, column = 7 }, end = { row = 5, column = -2 } }
      ]
    )


singleFieldInType : ( String, String, List MessageData )
singleFieldInType =
    ( "singleFieldInType"
    , """module Bar exposing (Foo)

type Foo =
  Bar { x : Int }
"""
    , [ SingleFieldRecord "./foo.elm" <|
            Range.manual
                { start = { row = 3, column = 6 }, end = { row = 3, column = 17 } }
                { start = { row = 3, column = 5 }, end = { row = 4, column = -2 } }
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
