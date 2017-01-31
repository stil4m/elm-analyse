module Parser.FileTests exposing (..)

import Parser.CombineTestUtil exposing (..)
import Expect
import Parser.Declarations as Parser exposing (..)
import AST.Types as Types exposing (..)
import Parser.Samples as Samples
import Test exposing (..)
import AST.Encoding
import Json.Encode


all : Test
all =
    describe "FileTests"
        [ Samples.allSamples
            |> List.indexedMap
                (\n s ->
                    test ("sample " ++ toString (n + 1)) <|
                        \() ->
                            parseFullStringState emptyState s Parser.file
                                |> (\x ->
                                        let
                                            _ =
                                                Debug.log "Encoded" (Maybe.map (Json.Encode.encode 0 << AST.Encoding.encode) x)
                                        in
                                            x
                                   )
                                |> Expect.notEqual Nothing
                )
            |> Test.concat
        ]
