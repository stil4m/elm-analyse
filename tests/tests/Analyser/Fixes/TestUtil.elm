module Analyser.Fixes.TestUtil exposing (testFix)

import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration as Configuration
import Analyser.FileContext as FileContext
import Analyser.Fixes.Base exposing (Fixer, Patch(..))
import Elm.Interface as Interface
import Elm.Parser as Parser
import Elm.Processing as Processing
import Elm.RawFile as RawFile exposing (RawFile)
import Elm.Syntax.File exposing (File)
import Expect
import Test exposing (Test, describe, test)


analyseAndFix : Checker -> Fixer -> String -> RawFile -> File -> Patch
analyseAndFix checker fixer input rawFile f =
    let
        fileContext =
            { interface = Interface.build rawFile
            , moduleName = FileContext.moduleName rawFile
            , ast = f
            , content = input
            , file =
                { path = "./Foo.elm"
                , version = "xxx"
                }
            }

        x =
            checker.check fileContext Configuration.defaultConfiguration
    in
    case x of
        [] ->
            Error "No message"

        y :: _ ->
            fixer.fix ( fileContext.content, fileContext.ast ) y


testFix : String -> Checker -> Fixer -> List ( String, String, String ) -> Test
testFix name checker fixer triples =
    describe name <|
        List.map
            (\( testName, input, output ) ->
                test testName <|
                    \() ->
                        case Parser.parse input |> Result.mapError (always "Parse Failed") of
                            Err e ->
                                Expect.fail e

                            Ok x ->
                                analyseAndFix checker
                                    fixer
                                    input
                                    x
                                    (Processing.process Processing.init x)
                                    |> Expect.equal (Patched output)
            )
        <|
            triples
