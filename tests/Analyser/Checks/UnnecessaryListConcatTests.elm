module Analyser.Checks.UnnecessaryListConcatTests exposing (..)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.UnnecessaryListConcat as UnnecessaryListConcat
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Range as Range
import Analyser.Messages.Types exposing (..)
import Test exposing (..)


couldMerge : ( String, String, List MessageData )
couldMerge =
    ( "couldMerge"
    , """module Bar exposing (foo)

foo =
    List.concat [ [1], [2] ]
"""
    , [ Data.init "foo"
            |> Data.addRange "range"
                (Range.manual
                    { start = { row = 3, column = 4 }, end = { row = 3, column = 28 } }
                    { start = { row = 3, column = 3 }, end = { row = 4, column = -2 } }
                )
      ]
    )


couldMerge2 : ( String, String, List MessageData )
couldMerge2 =
    ( "couldMerge2"
    , """module Bar exposing (..)

foo x =
  case x of
    DropConsOfItemAndList fileName range ->
        ( String.concat
            [ "Adding an item to the front of a literal list, but instead you can just put it in the list. ""
            , fileName
            , "" at "
            , rangeToString range
            ]
        , always (List.concat [ [ fileName ], [] ])
        , [ range ]
        , True
        )
  """
    , [ Data.init "foo"
            |> Data.addRange "range"
                (Range.manual
                    { start = { row = 11, column = 18 }, end = { row = 11, column = 50 } }
                    { start = { row = 11, column = 17 }, end = { row = 11, column = 49 } }
                )
      ]
    )


couldNotMerge : ( String, String, List MessageData )
couldNotMerge =
    ( "couldNotMerge"
    , """module Bar exposing (foo)

foo =
    List.concat [ bar, [2] ]
"""
    , []
    )


all : Test
all =
    CTU.build "Analyser.Checks.UnnecessaryListConcat"
        UnnecessaryListConcat.checker
        [ couldMerge
        , couldMerge2
        , couldNotMerge
        ]
