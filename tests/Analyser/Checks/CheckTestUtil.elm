module Analyser.Checks.CheckTestUtil exposing (..)

import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (defaultConfiguration)
import Analyser.Files.FileContent exposing (FileContent)
import Analyser.Messages.Data as Data exposing (MessageData)
import Elm.Interface as Interface
import Elm.Parser
import Elm.Processing as Processing
import Elm.RawFile as RawFile
import Expect
import Test exposing (Test, describe, test)


fileContentFromInput : String -> FileContent
fileContentFromInput input =
    { path = "./foo.elm"
    , ast = Nothing
    , formatted = True
    , sha1 = Nothing
    , content = Just input
    , success = True
    }


getMessages : String -> Checker -> Maybe (List MessageData)
getMessages input checker =
    Elm.Parser.parse (String.trim input)
        |> Result.map
            (\rawFile ->
                { interface = Interface.build rawFile
                , moduleName = RawFile.moduleName rawFile
                , ast = Processing.process Processing.init rawFile
                , content = String.trim input
                , file =
                    { path = "./foo.elm"
                    , version = ""
                    }
                , formatted = True
                }
            )
        |> Result.toMaybe
        |> Maybe.map (flip checker.check defaultConfiguration)
        |> Maybe.map (List.map (Data.withDescription "foo"))


build : String -> Checker -> List ( String, String, List MessageData ) -> Test
build suite checker cases =
    describe suite <|
        [ describe "Normal run" <|
            List.map
                (\( name, input, messages ) ->
                    test name (\() -> getMessages input checker |> Expect.equal (Just messages))
                )
                cases
        , describe "Schema check" <|
            List.map
                (\( name, input, _ ) ->
                    test name
                        (\() ->
                            getMessages input checker
                                |> Maybe.map (List.all (Data.conformToSchema checker.info.schema))
                                |> Expect.equal (Just True)
                        )
                )
                cases
        ]
