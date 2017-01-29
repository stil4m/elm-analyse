module Analyser.Checks.CheckTestUtil exposing (..)

import Analyser.FileContext as FileContext exposing (FileContext)
import Analyser.Messages exposing (Message)
import Interfaces.Interface as Interface
import AST.Util
import Analyser.Types exposing (..)
import Parser.Parser


getMessages : String -> (FileContext -> List Message) -> Maybe (List Message)
getMessages input f =
    Parser.Parser.parse input
        |> Maybe.map (\file -> ( "./foo.elm", Loaded { interface = Interface.build file, ast = file, moduleName = AST.Util.fileModuleName file } ))
        |> Maybe.andThen (\file -> FileContext.create [ file ] [] file)
        |> Maybe.map f
