module Analyser.Checks.UnnecessaryPortModule exposing (checker)

import AST.Types exposing (File, Case, LetBlock, VariablePointer, Destructuring, Pattern, Function, Lambda, Exposure, ModuleName, Expression, InnerExpression, FunctionSignature)
import Analyser.FileContext exposing (FileContext)
import AST.Util
import Analyser.Messages.Types exposing (Message, MessageData(UnnecessaryPortModule), newMessage)
import ASTUtil.Inspector as Inspector exposing (Order(Post), defaultConfig)
import Analyser.Configuration exposing (Configuration)
import Analyser.Checks.Base exposing (Checker, keyBasedChecker)


checker : Checker
checker =
    { check = scan
    , shouldCheck = keyBasedChecker [ "UnnecessaryPortModule" ]
    }


scan : FileContext -> Configuration -> List Message
scan fileContext _ =
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
