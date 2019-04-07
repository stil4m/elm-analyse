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
                { start = { row = 4, column = 3 }, end = { row = 4, column = 14 } }
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
                { start = { row = 5, column = 9 }, end = { row = 5, column = 23 } }
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
                { start = { row = 4, column = 7 }, end = { row = 4, column = 18 } }
      ]
    )


singleFieldAsGenericArg : ( String, String, List MessageData )
singleFieldAsGenericArg =
    ( "singleFieldAsGenericArg"
    , """module Bar exposing (Foo)

type alias Params x a =
    { x
        | id : String
        , label : String
        , action : a
    }

-- more type aliasses that extends from Params

type alias CheckboxParams a =
    Params { checked : Bool } (Bool -> a)
"""
    , []
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
        , singleFieldAsGenericArg
        ]
