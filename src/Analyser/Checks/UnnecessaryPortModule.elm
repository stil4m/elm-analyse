module Analyser.Checks.UnnecessaryPortModule exposing (checker)

import AST.Util
import ASTUtil.Inspector as Inspector exposing (Order(Post), defaultConfig)
import Analyser.Checks.Base exposing (Checker, keyBasedChecker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Range exposing (RangeContext)
import Analyser.Messages.Types exposing (Message, MessageData(UnnecessaryPortModule), newMessage)
import Elm.Syntax.Expression exposing (..)


checker : Checker
checker =
    { check = scan
    , shouldCheck = keyBasedChecker [ "UnnecessaryPortModule" ]
    , key = "UnnecessaryPortModule"
    , name = "Unnecessary Port Module"
    , description = "Dont use the port keyword if you do not need it."
    }


scan : RangeContext -> FileContext -> Configuration -> List Message
scan _ fileContext _ =
    if AST.Util.isPortModule fileContext.ast then
        let
            portDeclCount =
                Inspector.inspect
                    { defaultConfig | onPortDeclaration = Post onPortDeclaration }
                    fileContext.ast
                    0
        in
        if portDeclCount == 0 then
            [ newMessage
                [ ( fileContext.sha1, fileContext.path ) ]
                (UnnecessaryPortModule fileContext.path)
            ]
        else
            []
    else
        []


onPortDeclaration : FunctionSignature -> Int -> Int
onPortDeclaration _ x =
    x + 1
