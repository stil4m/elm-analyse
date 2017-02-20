module Parser.FileTests exposing (..)

import AST.Decoding
import AST.Encoding
import Expect
import Json.Decode
import Json.Encode
import Parser.CombineTestUtil exposing (..)
import Parser.Declarations as Parser exposing (..)
import Parser.File as Parser exposing (file)
import Parser.Samples as Samples
import Parser.Parser as Parser
import Test exposing (..)
import Parser.State exposing (emptyState)


all : Test
all =
    Test.concat
        [ describe "FileTests"
            [ Samples.allSamples
                |> List.indexedMap
                    (\n s ->
                        test ("sample " ++ toString (n + 1)) <|
                            \() ->
                                parseFullStringState emptyState s Parser.file |> Expect.notEqual Nothing
                    )
                |> Test.concat
            ]
        , describe "FileTests - serialisation"
            [ Samples.allSamples
                |> List.indexedMap
                    (\n s ->
                        test ("sample " ++ toString (n + 1)) <|
                            \() ->
                                let
                                    parsed =
                                        parseFullStringState emptyState s Parser.file

                                    roundTrip =
                                        parsed
                                            |> Maybe.map (AST.Encoding.encode >> Json.Encode.encode 0)
                                            |> Maybe.andThen (Json.Decode.decodeString AST.Decoding.decode >> Result.toMaybe)
                                in
                                    Expect.equal parsed roundTrip
                    )
                |> Test.concat
            ]
        ]
