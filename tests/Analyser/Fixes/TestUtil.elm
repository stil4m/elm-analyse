module Analyser.Fixes.TestUtil exposing (testFix)

import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.Fixes.Base exposing (Fixer)
import Test exposing (Test, describe, test)
import AST.Types exposing (File)
import Analyser.Files.Interface as Interface
import Analyser.Configuration as Configuration
import AST.Util exposing (fileModuleName)
import Parser.Parser as Parser
import Expect


analyseAndFix : Checker -> Fixer -> String -> File -> Result String String
analyseAndFix checker fixer input f =
    let
        fileContext =
            { interface = Interface.build f
            , moduleName = fileModuleName f
            , ast = f
            , content = input
            , path = "./Foo.elm"
            , sha1 = "xxx"
            }

        x =
            checker.check fileContext Configuration.defaultConfiguration
    in
        case x of
            [] ->
                Err "No message"

            x :: _ ->
                fixer.fix [ ( fileContext.path, fileContext.content, fileContext.ast ) ] x.data
                    |> Result.map (List.head >> Maybe.map Tuple.second >> Maybe.withDefault "")


testFix : String -> Checker -> Fixer -> List ( String, String, String ) -> Test
testFix name checker fixer triples =
    describe name <|
        List.map
            (\( name, input, output ) ->
                test name <|
                    \() ->
                        Parser.parse input
                            |> Result.fromMaybe "Parse Failed"
                            |> Result.andThen (analyseAndFix checker fixer input)
                            |> Expect.equal (Ok output)
            )
        <|
            triples
