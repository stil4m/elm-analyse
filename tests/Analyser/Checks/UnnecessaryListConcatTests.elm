module Analyser.Checks.UnnecessaryListConcatTests exposing (..)

import Analyser.Checks.UnnecessaryListConcat as UnnecessaryListConcat
import Analyser.Checks.CheckTestUtil as CTU
import Analyser.Messages.Types exposing (..)
import Test exposing (..)


couldMerge : ( String, String, List MessageData )
couldMerge =
    ( "couldMerge"
    , """module Bar exposing (foo)

foo =
    List.concat [ [1], [2] ]
"""
    , [ UnnecessaryListConcat "./foo.elm" { start = { row = 3, column = 3 }, end = { row = 4, column = -2 } }
      ]
    )


couldMerge2 : ( String, String, List MessageData )
couldMerge2 =
    ( "couldMerge2"
    , """

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
    , [ UnnecessaryListConcat "./foo.elm" { start = { row = 11, column = 17 }, end = { row = 11, column = 49 } }
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
