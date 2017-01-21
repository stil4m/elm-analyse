module ImportsTests exposing (..)

import Parser.Imports as Parser
import Parser.Types as Types
import Test exposing (..)
import Expect
import CombineTestUtil exposing (..)


all : Test
all =
    describe "ImportTest"
        [ test "import with explicits" <|
            \() ->
                parseFullStringWithNullState "import Foo exposing (Model, Msg(..))" Parser.importDefinition
                    |> Expect.equal
                        (Just
                            ({ moduleName = Types.ModuleName [ "Foo" ]
                             , moduleAlias = Nothing
                             , exposingList =
                                Types.Explicit
                                    [ Types.DefinitionExpose "Model"
                                    , Types.TypeExpose "Msg" (Types.All)
                                    ]
                             }
                            )
                        )
        , test "import with explicits 2" <|
            \() ->
                parseFullStringWithNullState "import Html exposing (text)" Parser.importDefinition
                    |> Expect.equal
                        (Just
                            ({ moduleName = Types.ModuleName [ "Html" ]
                             , moduleAlias = Nothing
                             , exposingList = Types.Explicit [ Types.DefinitionExpose "text" ]
                             }
                            )
                        )
        , test "import minimal" <|
            \() ->
                parseFullStringWithNullState "import Foo" Parser.importDefinition
                    |> Expect.equal
                        (Just
                            ({ moduleName = Types.ModuleName [ "Foo" ]
                             , moduleAlias = Nothing
                             , exposingList = Types.None
                             }
                            )
                        )
        , test "import with alias" <|
            \() ->
                parseFullStringWithNullState "import Foo as Bar" Parser.importDefinition
                    |> Expect.equal
                        (Just
                            ({ moduleName = Types.ModuleName [ "Foo" ]
                             , moduleAlias = Just (Types.ModuleName [ "Bar" ])
                             , exposingList = Types.None
                             }
                            )
                        )
        ]
