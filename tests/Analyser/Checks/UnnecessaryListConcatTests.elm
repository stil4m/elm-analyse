module Analyser.Checks.UnnecessaryListConcatTests exposing (all)

import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Checks.UnnecessaryListConcat as UnnecessaryListConcat
import Analyser.Messages.Data as Data exposing (MessageData)
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
                { start = { row = 4, column = 5 }, end = { row = 4, column = 29 } }
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
                { start = { row = 12, column = 19 }, end = { row = 12, column = 51 } }
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
