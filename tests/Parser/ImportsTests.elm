module Parser.ImportsTests exposing (..)

import Parser.Imports as Parser
import AST.Types exposing (..)
import AST.Ranges exposing (..)
import Test exposing (..)
import Expect
import Parser.CombineTestUtil exposing (..)


all : Test
all =
    describe "ImportTest"
        [ test "import with explicits" <|
            \() ->
                parseFullStringWithNullState "import Foo exposing (Model, Msg(..))" Parser.importDefinition
                    |> Maybe.map noRangeImport
                    |> Expect.equal
                        (Just
                            ({ moduleName = [ "Foo" ]
                             , moduleAlias = Nothing
                             , exposingList =
                                Explicit
                                    [ DefinitionExpose "Model"
                                    , TypeExpose "Msg" (All { start = { row = 1, column = 32 }, end = { row = 1, column = 34 } })
                                    ]
                             , range = emptyRange
                             }
                            )
                        )
        , test "import with explicits 2" <|
            \() ->
                parseFullStringWithNullState "import Html exposing (text)" Parser.importDefinition
                    |> Maybe.map noRangeImport
                    |> Expect.equal
                        (Just
                            ({ moduleName = [ "Html" ]
                             , moduleAlias = Nothing
                             , exposingList = Explicit [ DefinitionExpose "text" ]
                             , range = emptyRange
                             }
                            )
                        )
        , test "import minimal" <|
            \() ->
                parseFullStringWithNullState "import Foo" Parser.importDefinition
                    |> Maybe.map noRangeImport
                    |> Expect.equal
                        (Just
                            ({ moduleName = [ "Foo" ]
                             , moduleAlias = Nothing
                             , exposingList = None
                             , range = emptyRange
                             }
                            )
                        )
        , test "import with alias" <|
            \() ->
                parseFullStringWithNullState "import Foo as Bar" Parser.importDefinition
                    |> Maybe.map noRangeImport
                    |> Expect.equal
                        (Just
                            ({ moduleName = [ "Foo" ]
                             , moduleAlias = Just ([ "Bar" ])
                             , exposingList = None
                             , range = emptyRange
                             }
                            )
                        )
        ]
