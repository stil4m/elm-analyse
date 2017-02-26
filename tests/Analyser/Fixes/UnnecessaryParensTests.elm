module Analyser.Fixes.UnnecessaryParensTests exposing (all)

import Test exposing (Test, describe, test)
import Expect
import Parser.Parser as Parser
import Analyser.Fixes.UnnecessaryParens exposing (fixer)
import Analyser.Checks.UnnecessaryParens exposing (checker)
import AST.Util exposing (fileModuleName)
import Analyser.Files.Interface as Interface
import Analyser.Configuration as Configuration
import AST.Types exposing (File)


fixInFile : ( String, String, String )
fixInFile =
    ( "fixInFile"
    , """module Foo

f =
    (1)

g =
    2"""
    , """module Foo

f =
     1

g =
    2"""
    )


fixOnLastLineWithoutNewLine : ( String, String, String )
fixOnLastLineWithoutNewLine =
    ( "fixOnLastLineWithoutNewLine"
    , """module Foo

f =
  (1)"""
    , """module Foo

f =
  1"""
    )


fixOnLastLineWithNewLine : ( String, String, String )
fixOnLastLineWithNewLine =
    ( "fixOnLastLineWithNewLine"
    , """module Foo

f =
    (1)
"""
    , """module Foo

f =
    1"""
    )


analyseAndFix : String -> File -> Result String String
analyseAndFix input f =
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


all : Test
all =
    describe "Analyser.Fixes.UnusedImportAlias" <|
        List.map
            (\( name, input, output ) ->
                test name <|
                    \() ->
                        Parser.parse input
                            |> Result.fromMaybe "Parse Failed"
                            |> Result.andThen (analyseAndFix input)
                            |> Expect.equal (Ok output)
            )
        <|
            [ fixInFile
            , fixOnLastLineWithoutNewLine
            , fixOnLastLineWithNewLine
            ]
