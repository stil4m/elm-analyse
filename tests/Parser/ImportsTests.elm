module Parser.ImportsTests exposing (..)

import Parser.Imports as Parser
import Parser.Types exposing (..)
import Test exposing (..)
import Expect
import Parser.CombineTestUtil exposing (..)


all : Test
all =
    describe "ImportTest"
        [ test "import with explicits" <|
            \() ->
                parseFullStringWithNullState "import Foo exposing (Model, Msg(..))" Parser.importDefinition
                    |> Expect.equal
                        (Just
                            ({ moduleName = [ "Foo" ]
                             , moduleAlias = Nothing
                             , exposingList =
                                Explicit
                                    [ DefinitionExpose "Model"
                                    , TypeExpose "Msg" (All)
                                    ]
                             }
                            )
                        )
        , test "import with explicits 2" <|
            \() ->
                parseFullStringWithNullState "import Html exposing (text)" Parser.importDefinition
                    |> Expect.equal
                        (Just
                            ({ moduleName = [ "Html" ]
                             , moduleAlias = Nothing
                             , exposingList = Explicit [ DefinitionExpose "text" ]
                             }
                            )
                        )
        , test "import minimal" <|
            \() ->
                parseFullStringWithNullState "import Foo" Parser.importDefinition
                    |> Expect.equal
                        (Just
                            ({ moduleName = [ "Foo" ]
                             , moduleAlias = Nothing
                             , exposingList = None
                             }
                            )
                        )
        , test "import with alias" <|
            \() ->
                parseFullStringWithNullState "import Foo as Bar" Parser.importDefinition
                    |> Expect.equal
                        (Just
                            ({ moduleName = [ "Foo" ]
                             , moduleAlias = Just ([ "Bar" ])
                             , exposingList = None
                             }
                            )
                        )
        ]
