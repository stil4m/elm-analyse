module Analyser.Fixes.UnusedTypeAliasTests exposing (all)

import Analyser.Checks.UnusedTypeAlias exposing (checker)
import Analyser.Fixes.TestUtil exposing (testFix)
import Analyser.Fixes.UnusedTypeAlias exposing (fixer)
import Test exposing (Test, only)


unusedTypeAlias : ( String, String, String )
unusedTypeAlias =
    ( "unusedTypeAlias"
    , """module Foo exposing (f)

type alias Foo =
  Int

foo =
  1
"""
    , """module Foo exposing (f)



foo =
  1
"""
    )


unusedTypeAliasWithDocumentation : ( String, String, String )
unusedTypeAliasWithDocumentation =
    ( "unusedTypeAliasWithDocumentation"
    , """module Foo exposing (f)

{-| Some Doc -}
type alias Foo =
  Int

foo =
  1
"""
    , """module Foo exposing (f)



foo =
  1
"""
    )


all : Test
all =
    testFix "Analyser.Fixes.UnusedImportTests"
        checker
        fixer
        [ unusedTypeAlias
        , unusedTypeAliasWithDocumentation
        ]
