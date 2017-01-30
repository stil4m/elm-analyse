module Analyser.Checks.CheckTestUtil exposing (..)

import Analyser.FileContext as FileContext exposing (FileContext)
import Analyser.Messages exposing (Message)
import Interfaces.Interface as Interface
import AST.Util
import Analyser.Types exposing (..)
import Parser.Parser
import Test exposing (Test, describe, test)
import Expect


getMessages : String -> (FileContext -> List Message) -> Maybe (List Message)
getMessages input f =
    Parser.Parser.parse input
        -- |> Debug.log "File"
        |>
            Maybe.map (\file -> ( "./foo.elm", Loaded { interface = Interface.build file, ast = file, moduleName = AST.Util.fileModuleName file } ))
        |> Maybe.andThen (\file -> FileContext.create [ file ] [] file)
        |> Maybe.map f


build : String -> (FileContext -> List Message) -> List ( String, String, List Message ) -> Test
build suite f cases =
    describe suite <|
        List.map
            (\( name, input, messages ) ->
                test name (\() -> getMessages input f |> Expect.equal (Just messages))
            )
            cases
