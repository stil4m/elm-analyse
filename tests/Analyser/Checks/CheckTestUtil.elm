module Analyser.Checks.CheckTestUtil exposing (..)

import Analyser.FileContext as FileContext exposing (FileContext)
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (defaultConfiguration)
import Analyser.Files.Interface as Interface
import Analyser.Messages.Types exposing (Message, MessageData)
import AST.Util
import Analyser.Files.Types exposing (..)
import Parser.Parser
import Test exposing (Test, describe, test)
import Expect


fileContentFromInput : String -> FileContent
fileContentFromInput input =
    { path = "./foo.elm", ast = Nothing, formatted = True, sha1 = Nothing, content = Just input, success = True }


getMessages : String -> Checker -> Maybe (List MessageData)
getMessages input checker =
    Parser.Parser.parse input
        |> Result.map (\file -> ( fileContentFromInput input, Loaded { interface = Interface.build file, ast = file, moduleName = AST.Util.fileModuleName file } ))
        |> Result.toMaybe
        |> Maybe.andThen (\file -> FileContext.create [ file ] [] file)
        |> Maybe.map (flip checker.check defaultConfiguration >> List.map .data)


build : String -> Checker -> List ( String, String, List MessageData ) -> Test
build suite checker cases =
    describe suite <|
        List.map
            (\( name, input, messages ) ->
                test name (\() -> getMessages input checker |> Expect.equal (Just messages))
            )
            cases
