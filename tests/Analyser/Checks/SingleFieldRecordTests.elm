module Analyser.Checks.SingleFieldRecordTests exposing (all)

import Analyser.Checks.SingleFieldRecord as SingleFieldRecord
import Test exposing (Test)
import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Messages.Types exposing (Message, MessageData(SingleFieldRecord), newMessage)
import Analyser.Messages.Range as Range


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


singelFieldNested : ( String, String, List MessageData )
singelFieldNested =
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


singelFieldInType : ( String, String, List MessageData )
singelFieldInType =
    ( "multiLineMultiFieldWithNested"
    , """module Bar exposing (Foo)

type Foo =
  Bar { x : Int }
"""
    , [ SingleFieldRecord "./foo.elm" <|
            Range.manual
                { start = { row = 4, column = 8 }, end = { row = 4, column = 33 } }
                { start = { row = 4, column = 7 }, end = { row = 5, column = -2 } }
      ]
    )


all : Test
all =
    CTU.build "Analyser.Checks.SingleFieldRecord"
        SingleFieldRecord.checker
        [ singleField
        , singleFieldGeneric
        , multiField
        , singelFieldNested
        ]
