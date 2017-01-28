module Parser.FileTests exposing (..)

import Parser.CombineTestUtil exposing (..)
import Expect
import Parser.Declarations as Parser exposing (..)
import AST.Types as Types exposing (..)
import Parser.Samples as Samples
import Test exposing (..)


all : Test
all =
    describe "FileTests"
        [ Samples.allSamples
            |> List.indexedMap
                (\n s ->
                    test ("sample " ++ toString (n + 1)) <|
                        \() ->
                            parseFullStringState emptyState s Parser.file
                                |> Expect.notEqual Nothing
                )
            |> Test.concat
        ]
