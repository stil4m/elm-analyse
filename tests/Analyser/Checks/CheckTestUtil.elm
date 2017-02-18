module Analyser.Checks.CheckTestUtil exposing (..)

import Analyser.Files.FileContext as FileContext exposing (FileContext)
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


getMessages : String -> (FileContext -> List Message) -> Maybe (List MessageData)
getMessages input f =
    Parser.Parser.parse input
        |> Maybe.map (\file -> ( fileContentFromInput input, Loaded { interface = Interface.build file, ast = file, moduleName = AST.Util.fileModuleName file } ))
        |> Maybe.andThen (\file -> FileContext.create [ file ] [] file)
        |> Maybe.map (f >> List.map .data)


build : String -> (FileContext -> List Message) -> List ( String, String, List MessageData ) -> Test
build suite f cases =
    describe suite <|
        List.map
            (\( name, input, messages ) ->
                test name (\() -> getMessages input f |> Expect.equal (Just messages))
            )
            cases
