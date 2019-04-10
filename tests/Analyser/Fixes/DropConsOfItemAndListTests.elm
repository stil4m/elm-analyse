module Analyser.Fixes.DropConsOfItemAndListTests exposing (all)

import Analyser.Checks.DropConsOfItemAndList exposing (checker)
import Analyser.Fixes.DropConsOfItemAndList exposing (fixer)
import Analyser.Fixes.TestUtil exposing (testFix)
import Test exposing (Test, only)


consWithLiteralList : ( String, String, String )
consWithLiteralList =
    ( "consWithLiteralList"
    , """module Bar exposing (foo)

foo : Int
foo =
    1 :: [ 2, 3]
"""
    , """module Bar exposing (foo)

foo : Int
foo =
    [ 1, 2, 3]
"""
    )


separateLines : ( String, String, String )
separateLines =
    ( "separateLines"
    , """module Bar exposing (foo)

foo : Int
foo =
    1
        :: [ 2, 3]
"""
    , """module Bar exposing (foo)

foo : Int
foo =
    [ 1, 2, 3]
"""
    )


itemsWithSubLists : ( String, String, String )
itemsWithSubLists =
    ( "itemsWithSubLists"
    , """module Bar exposing (foo)

foo : Int
foo =
    [ 1, 2 ] :: [ [ 3, 4 ], [ 5, 6 ] ]
"""
    , """module Bar exposing (foo)

foo : Int
foo =
    [ [ 1, 2 ], [ 3, 4 ], [ 5, 6 ] ]
"""
    )


all : Test
all =
    testFix "Analyser.Fixes.DropConsOfItemAndList"
        checker
        fixer
        [ consWithLiteralList
        , separateLines
        , itemsWithSubLists
        ]
