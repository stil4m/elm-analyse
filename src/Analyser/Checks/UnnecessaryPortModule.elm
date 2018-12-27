module Analyser.Checks.UnnecessaryPortModule exposing (checker)

import ASTUtil.Inspector as Inspector exposing (Order(..), defaultConfig)
import Analyser.Checks.Base exposing (Checker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Schema as Schema
import Elm.Syntax.Expression exposing (Expression(..))
import Elm.Syntax.Module
import Elm.Syntax.Node as Node exposing (Node)
import Elm.Syntax.Signature exposing (Signature)


checker : Checker
checker =
    { check = scan
    , info =
        { key = "UnnecessaryPortModule"
        , name = "Unnecessary Port Module"
        , description = "Dont use the port keyword if you do not need it."
        , schema =
            Schema.schema
        }
    }


scan : FileContext -> Configuration -> List MessageData
scan fileContext _ =
    if Elm.Syntax.Module.isPortModule <| Node.value fileContext.ast.moduleDefinition then
        let
            portDeclCount =
                Inspector.inspect
                    { defaultConfig | onPortDeclaration = Post onPortDeclaration }
                    fileContext.ast
                    0
        in
        if portDeclCount == 0 then
            [ Data.init "Module defined a `port` module, but is does not declare ports. It may be better to remove these." ]

        else
            []

    else
        []


onPortDeclaration : Node Signature -> Int -> Int
onPortDeclaration _ x =
    x + 1
