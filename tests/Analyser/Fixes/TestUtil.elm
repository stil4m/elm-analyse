module Analyser.Fixes.TestUtil exposing (testFix)

import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.Fixes.Base exposing (Fixer)
import Elm.Interface as Interface
import Test exposing (Test, describe, test)
import Elm.Syntax.File exposing (File)
import Analyser.Configuration as Configuration
import Elm.Parser as Parser
import Expect
import Elm.Processing as Processing
import Elm.RawFile as RawFile exposing (RawFile)


analyseAndFix : Checker -> Fixer -> String -> RawFile -> File -> Result String String
analyseAndFix checker fixer input rawFile f =
    let
        fileContext =
            { interface = Interface.build rawFile
            , moduleName = RawFile.moduleName rawFile
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
                            |> Result.mapError (always "Parse Failed")
                            |> Result.andThen
                                (\x ->
                                    analyseAndFix checker
                                        fixer
                                        input
                                        x
                                        (Processing.process Processing.init x)
                                )
                            |> Expect.equal (Ok output)
            )
        <|
            triples
